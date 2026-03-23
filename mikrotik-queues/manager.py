import sys
import json
import routeros_api

def get_sorted_queues(api):
    """
    Obtiene y ordena las colas del árbol de forma jerárquica (padre seguido de hijos).
    """
    resource_queue_tree = api.get_resource('/queue/tree')
    queues = resource_queue_tree.get()
    
    # 1. Crear un mapa de IDs a objetos de cola para referencia rápida.
    queue_map = {q['id']: q for q in queues}
    
    # 2. Clasificar colas en base a su padre:   
    parent_queues_list = []
    children_map = {}
    
    for q in queues:
        parent_id = q.get('parent')
        
        # Un padre "lógico" es aquel cuyo padre es otra Queue Tree (su ID existe en queue_map)
        is_logical_child = parent_id and parent_id in queue_map
        
        if is_logical_child:
            if parent_id not in children_map:
                children_map[parent_id] = []
            children_map[parent_id].append(q)
        else:
            # Es un elemento de nivel superior (padre de WinBox, con parent=interface o no parent)
            parent_queues_list.append(q)
            
    # 3. Ordenar la lista final
    sorted_queues = []
    # Ordenar los padres de nivel superior alfabéticamente por nombre
    parent_queues_list.sort(key=lambda x: x['name'])
    
    for p in parent_queues_list:
        sorted_queues.append(p)
        
        # Si este padre tiene hijos lógicos (otras queues que dependen de él),
        # ordenarlos alfabéticamente y agregarlos inmediatamente.
        if p['id'] in children_map:
            children = children_map[p['id']]
            children.sort(key=lambda x: x['name'])
            sorted_queues.extend(children)
            
    return sorted_queues


def main():
    if len(sys.argv) < 5:
        print(json.dumps({"status": "error", "message": "Argumentos insuficientes."}))
        return

    ip, user, password, action = sys.argv[1:5]
    params = sys.argv[5:]

    try:
        connection = routeros_api.RouterOsApiPool(
            ip, 
            username=user, 
            password=password, 
            plaintext_login=True
        )
        api = connection.get_api()
    except Exception as e:
        print(json.dumps({"status": "error", "message": f"Error de conexión: {e}"}))
        return

    try:
        resource_queues = api.get_resource('/queue/simple')
        resource_rules = api.get_resource('/routing/rule')
        resource_queue_tree = api.get_resource('/queue/tree')
        resource_mangle = api.get_resource('/ip/firewall/mangle')

        if action == "list":
            queues = resource_queues.get()
            print(json.dumps({"status": "success", "data": queues}, ensure_ascii=False))

        elif action == "get_one":
            queue_data = resource_queues.get(id=params[0])
            print(json.dumps({"status": "success", "data": queue_data[0] if queue_data else None}, ensure_ascii=False))

        elif action == "add":
            queue_type_value = params[4]
            formatted_queue_type = f"{queue_type_value}/{queue_type_value}"
            resource_queues.add(name=params[0], target=params[1], max_limit=params[2], priority=params[3], queue=formatted_queue_type)
            print(json.dumps({"status": "success", "message": "Queue añadida correctamente."}, ensure_ascii=False))

        elif action == "edit":
            queue_type_value = params[5]
            formatted_queue_type = f"{queue_type_value}/{queue_type_value}"
            resource_queues.set(id=params[0], name=params[1], target=params[2], max_limit=params[3], priority=params[4], queue=formatted_queue_type)
            print(json.dumps({"status": "success", "message": "Queue actualizada correctamente."}, ensure_ascii=False))

        elif action == "delete":
            resource_queues.remove(id=params[0])
            print(json.dumps({"status": "success", "message": "Queue eliminada correctamente."}, ensure_ascii=False))

        elif action == "traffic":
            traffic_data = resource_queues.get()
            print(json.dumps({"status": "success", "data": traffic_data}, ensure_ascii=False))
            
        elif action == "suspend":
            queue_id = params[0]
            queue_info = resource_queues.get(id=queue_id)[0]
            original_max_limit = queue_info.get('max-limit', '1M/1M')
            resource_queues.set(id=queue_id, max_limit='1k/1k', comment=f"suspended_plan={original_max_limit}")
            print(json.dumps({"status": "success", "message": "Queue suspendida."}, ensure_ascii=False))

        elif action == "activate":
            queue_id = params[0]
            queue_info = resource_queues.get(id=queue_id)[0]
            comment = queue_info.get('comment', '')
            if "suspended_plan=" in comment:
                restored_plan = comment.split('=')[1]
                resource_queues.set(id=queue_id, max_limit=restored_plan, comment='')
                print(json.dumps({"status": "success", "message": "Queue activada."}, ensure_ascii=False))
            else:
                resource_queues.set(id=queue_id, max_limit='1M/1M', comment='')
                print(json.dumps({"status": "warning", "message": "No se encontró plan guardado, se activó con 1M/1M."}, ensure_ascii=False))
        
        elif action == "get_queue_types":
            queue_type_resource = api.get_resource('/queue/type')
            types = queue_type_resource.get()
            print(json.dumps({"status": "success", "data": types}, ensure_ascii=False))

        elif action == "list_rules":
            rules = resource_rules.get()
            print(json.dumps({"status": "success", "data": rules}, ensure_ascii=False))

        elif action == "get_one_rule":
            rule_data = resource_rules.get(id=params[0])
            print(json.dumps({"status": "success", "data": rule_data[0] if rule_data else None}, ensure_ascii=False))

        elif action == "add_rule":
            # CORRECCIÓN: Manejo de parámetros para evitar errores de índice y asegurar respuesta JSON
            try:
                table_name = params[0]
                rule_params = { 'action': 'lookup', 'table': table_name }
                if len(params) > 1 and params[1] and params[1].strip() not in ["", "''", '""']:
                    rule_params['src-address'] = params[1].strip()
                if len(params) > 2 and params[2] and params[2].strip() not in ["", "''", '""']:
                    rule_params['dst-address'] = params[2].strip()
                if len(params) > 3 and params[3] and params[3].strip() not in ["", "''", '""']:
                    rule_params['comment'] = params[3].strip()
                
                resource_rules.add(**rule_params)
                print(json.dumps({"status": "success", "message": "Regla creada satisfactoriamente."}, ensure_ascii=False))
            except Exception as e:
                print(json.dumps({"status": "error", "message": f"Error al añadir regla: {str(e)}"}, ensure_ascii=False))

        elif action == "edit_rule":
            # CORRECCIÓN: Sincronización de parámetros para edición
            try:
                rule_id = params[0]
                table_name = params[1]
                rule_params = { 'id': rule_id, 'action': 'lookup', 'table': table_name }
                if len(params) > 2 and params[2] and params[2].strip() not in ["", "''", '""']:
                    rule_params['src-address'] = params[2].strip()
                if len(params) > 3 and params[3] and params[3].strip() not in ["", "''", '""']:
                    rule_params['dst-address'] = params[3].strip()
                if len(params) > 4 and params[4] and params[4].strip() not in ["", "''", '""']:
                    rule_params['comment'] = params[4].strip()
                
                resource_rules.set(**rule_params)
                print(json.dumps({"status": "success", "message": "Regla actualizada satisfactoriamente."}, ensure_ascii=False))
            except Exception as e:
                print(json.dumps({"status": "error", "message": f"Error al editar regla: {str(e)}"}, ensure_ascii=False))

        elif action == "delete_rule":
            resource_rules.remove(id=params[0])
            print(json.dumps({"status": "success", "message": "Regla eliminada correctamente."}, ensure_ascii=False))
            
        elif action == "enable_rule":
            try:
                resource_rules.set(id=params[0], disabled='no')
                print(json.dumps({"status": "success", "message": "Regla activada correctamente."}, ensure_ascii=False))
            except Exception as e:
                print(json.dumps({"status": "error", "message": f"Error al activar la regla: {e}"}, ensure_ascii=False))

        elif action == "disable_rule":
            try:
                resource_rules.set(id=params[0], disabled='yes')
                print(json.dumps({"status": "success", "message": "Regla desactivada correctamente."}, ensure_ascii=False))
            except Exception as e:
                print(json.dumps({"status": "error", "message": f"Error al desactivar la regla: {e}"}, ensure_ascii=False))

        elif action == "get_routing_tables":
            all_tables = set()
            try:
                route_resource = api.get_resource('/routing/route')
                routes = route_resource.get()
            except routeros_api.exceptions.RouterOsApiResourceNotFound:
                route_resource = api.get_resource('/ip/route')
                routes = route_resource.get()
            
            for route in routes:
                if route.get('table'):
                    all_tables.add(route.get('table'))

            rules = resource_rules.get()
            for rule in rules:
                if rule.get('table'):
                    all_tables.add(rule.get('table'))
            
            all_tables.add('main')
            tables = sorted(list(all_tables))
            print(json.dumps({"status": "success", "data": tables}, ensure_ascii=False))

        elif action == "get_interfaces":
            interface_resource = api.get_resource('/interface')
            interfaces = interface_resource.get()
            print(json.dumps({"status": "success", "data": interfaces}, ensure_ascii=False))

        elif action == "get_interfaces_and_queues":
            interface_resource = api.get_resource('/interface')
            interfaces = interface_resource.get()
            tree_queues = resource_queue_tree.get()
            options = []
            options.append({'id': 'global', 'name': 'global', 'type': 'global'})
            for iface in interfaces:
                options.append({
                    'id': iface['name'], 
                    'name': iface['name'] + (f" ({iface.get('comment', '')})" if iface.get('comment') else ''),
                    'type': 'interface'
                })
            for q in tree_queues:
                 options.append({'id': q['id'], 'name': q['name'], 'type': 'queue-tree'})
            options.sort(key=lambda x: x['name'])
            print(json.dumps({"status": "success", "data": options}, ensure_ascii=False))

        elif action == "get_packet_marks":
            mangle_rules = resource_mangle.get()
            marks = set()
            for rule in mangle_rules:
                if rule.get('new-connection-mark') and rule['new-connection-mark'] != 'no-mark':
                    marks.add(rule['new-connection-mark'])
                if rule.get('new-routing-mark') and rule['new-routing-mark'] != 'no-mark':
                    marks.add(rule['new-routing-mark'])
                if rule.get('new-packet-mark') and rule['new-packet-mark'] != 'no-mark':
                    marks.add(rule['new-packet-mark'])
            sorted_marks = sorted(list(marks))
            print(json.dumps({"status": "success", "data": sorted_marks}, ensure_ascii=False))
            
        elif action == "list_tree":
            sorted_queues = get_sorted_queues(api)
            print(json.dumps({"status": "success", "data": sorted_queues}, ensure_ascii=False))

        elif action == "get_one_tree":
            tree_data = resource_queue_tree.get(id=params[0])
            print(json.dumps({"status": "success", "data": tree_data[0] if tree_data else None}, ensure_ascii=False))

        elif action == "add_tree":
            resource_queue_tree.add(
                name=params[0],
                parent=params[1],
                interface=params[2] if params[2] else None,
                **{k: v for k, v in zip(['packet-mark', 'priority', 'queue', 'limit-at', 'max-limit', 'burst-limit', 'burst-threshold', 'burst-time', 'comment'], params[3:]) if v}
            )
            print(json.dumps({"status": "success", "message": "Queue Tree añadida correctamente."}, ensure_ascii=False))

        elif action == "edit_tree":
            resource_queue_tree.set(
                id=params[0],
                name=params[1],
                parent=params[2],
                interface=params[3] if params[3] else None,
                **{k: v for k, v in zip(['packet-mark', 'priority', 'queue', 'limit-at', 'max-limit', 'burst-limit', 'burst-threshold', 'burst-time', 'comment'], params[4:]) if v}
            )
            print(json.dumps({"status": "success", "message": "Queue Tree actualizada correctamente."}, ensure_ascii=False))

        elif action == "delete_tree":
            resource_queue_tree.remove(id=params[0])
            print(json.dumps({"status": "success", "message": "Queue Tree eliminada correctamente."}, ensure_ascii=False))

        elif action == "get_parent_queues":
            simple_queues = resource_queues.get()
            tree_queues = resource_queue_tree.get()
            parent_queues = simple_queues + tree_queues
            print(json.dumps({"status": "success", "data": parent_queues}, ensure_ascii=False))

        else:
            print(json.dumps({"status": "error", "message": "Acción no reconocida."}, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"status": "error", "message": f"Fallo crítico: {str(e)}"}, ensure_ascii=False))
    
    finally:
        connection.disconnect()

if __name__ == "__main__":
    main()