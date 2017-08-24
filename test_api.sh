#!/bin/bash

curl --insecure -G https://localhost:18443/api/log --data-urlencode 'json={"type":"session_begin", "data":{"game_id":"VistaLights", "player_id":"9e7b772d0236f31ed7b84936d004b973a74ce672", "session_id":"7f6fcf5a-a799-4462-b759-018e8c538b4a", "build_id":"", "version":"2.0", "condition":"", "client_time":"1500386994.30502", "details":{}}}'

curl --insecure -G https://localhost:18443/api/log --data-urlencode 'json={"type":"run_begin", "data":{"session_id":"7f6fcf5a-a799-4462-b759-018e8c538b4a", "run_id":"25e8dae5-19e0-4bfa-8b07-3b4147a86205", "run_seqno":"1", "client_time":"1500387006.54184", "details":{"current_time":"10/10/2015 10:10:10 AM", "map":"houston_game_1", "give_recommendation":"True", "with_justification":"False"}}}'

curl --insecure -G https://localhost:18443/api/log --data-urlencode 'json={"type":"action", "data":{"run_id":"25e8dae5-19e0-4bfa-8b07-3b4147a86205", "action_seqno":"0", "type":"1", "client_time":"1500387006.90927", "details":{"current_time":"1/1/2016 12:00:00 PM", "timer":"100"}, "session_id":"7f6fcf5a-a799-4462-b759-018e8c538b4a"}}'

curl --insecure -G https://localhost:18443/api/log --data-urlencode 'json={"type":"run_end", "data":{"run_id":"25e8dae5-19e0-4bfa-8b07-3b4147a86205", "action_count":"328", "client_time":"1500387498.20408", "details":{"current_time":"1/6/2016 12:00:14 PM", "budget":"3307699.32023331", "welfare":"3.8520765820864", "dock_utilization":"0.235788022659538"}, "session_id":"7f6fcf5a-a799-4462-b759-018e8c538b4a"}}'

curl --insecure -G https://localhost:18443/api/log --data-urlencode 'json={"type":"session_end", "data":{"session_id":"7f6fcf5a-a799-4462-b759-018e8c538b4a", "run_count":"2", "client_time":"1500387504.42295", "details":{}}}'