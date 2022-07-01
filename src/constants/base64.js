const assignedDriver = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCI+DQogIDxkZWZzPg0KICAgIDxmaWx0ZXIgaWQ9IkVsbGlwc2VfNTMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4NCiAgICAgIDxmZU9mZnNldCBkeT0iMyIgaW5wdXQ9IlNvdXJjZUFscGhhIi8+DQogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyLjUiIHJlc3VsdD0iYmx1ciIvPg0KICAgICAgPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMC4xNjEiLz4NCiAgICAgIDxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0iYmx1ciIvPg0KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIi8+DQogICAgPC9maWx0ZXI+DQogIDwvZGVmcz4NCiAgPGcgaWQ9ImFzc2lnbmVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3LjUgNC41KSI+DQogICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTcuNSwgLTQuNSkiIGZpbHRlcj0idXJsKCNFbGxpcHNlXzUzKSI+DQogICAgICA8ZyBpZD0iRWxsaXBzZV81My0yIiBkYXRhLW5hbWU9IkVsbGlwc2UgNTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuNSA0LjUpIiBmaWxsPSIjZmYyYTFhIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS41Ij4NCiAgICAgICAgPGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjEyLjUiIHN0cm9rZT0ibm9uZSIvPg0KICAgICAgICA8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTIuNSIgcj0iMTEuNzUiIGZpbGw9Im5vbmUiLz4NCiAgICAgIDwvZz4NCiAgICA8L2c+DQogICAgPGcgaWQ9Ikdyb3VwXzU4NyIgZGF0YS1uYW1lPSJHcm91cCA1ODciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDQzIDUuODE4KSI+DQogICAgICA8cGF0aCBpZD0iUGF0aF80MzUiIGRhdGEtbmFtZT0iUGF0aCA0MzUiIGQ9Ik0tMTQ1MS42ODMsODM2Ljg5Yy0uMTI4LDAtLjI3OCwwLS40MjgsMHEtLjYxMy0uMDEyLS40MTgtLjZjLjAzNS0uMTA2LjA3MS0uMjExLjEwOC0uMzE2YS44MzIuODMyLDAsMCwxLC44OC0uNjMzYy40NSwwLC40NDYsMCwuNi0uNDI0LjMxMS0uODU5LjYzMS0xLjcxNC45MzktMi41NzRhMS41NjEsMS41NjEsMCwwLDEsLjgtLjg2OCw0Ljg4LDQuODgsMCwwLDEsMi4wNzQtLjU0NWMuOTc4LS4wMzksMS45NTgtLjA3MiwyLjkzNy0uMDY5YTguMDcyLDguMDcyLDAsMCwxLDIuNzg5LjM4Nyw0Ljc2OCw0Ljc2OCwwLDAsMSwuNzk1LjQsMS4wNSwxLjA1LDAsMCwxLC40MjguNTY0Yy4zNjIuOTg0LjcyOCwxLjk2NiwxLjA4NSwyLjk1MS4wNDguMTMyLjEwOS4xODcuMjUxLjE3OGEyLjU2NCwyLjU2NCwwLDAsMSwuNDc0LjAxMi43NjIuNzYyLDAsMCwxLC42MzUuNDkxLDQuNjA4LDQuNjA4LDAsMCwxLC4xNzguNTE0LjM2My4zNjMsMCwwLDEtLjM2LjUxOWMtLjE3NC4wMTMtLjM1LDAtLjU1NSwwYTQuNDg2LDQuNDg2LDAsMCwxLC4xNDQuNDczLDIuNjkxLDIuNjkxLDAsMCwxLC4wNDIuNDg5cTAsMi4yMSwwLDQuNDJhLjU0OC41NDgsMCwwLDEtLjYyNy42MjJoLTEuNzc5YS41NTYuNTU2LDAsMCwxLS42MjktLjYxMWMtLjAwNy0uMjIzLS4wMTItLjQ0NywwLS42NjkuMDEtLjE3My0uMDUzLS4yMTYtLjIyLS4yMTYtMS44NzIuMDA1LTMuNzQ1LDAtNS42MTgsMC0uNDgxLDAtLjk2My4wMDYtMS40NDQsMC0uMTU5LDAtLjIuMDUyLS4yLjIuMDExLjIyMy4wMDcuNDQ2LDAsLjY2OWEuNTYuNTYsMCwwLDEtLjYzNS42MjRxLS45MDcsMC0xLjgxNCwwYS41MzcuNTM3LDAsMCwxLS41ODctLjU5MWMwLTEuNS0uMDA4LTIuOTk0LjAwNi00LjQ5MUE2LjYsNi42LDAsMCwxLTE0NTEuNjgzLDgzNi44OVptMTEuNDgyLTEuMzJjLS4wMTEtLjA1NC0uMDEzLS4wNzYtLjAyLS4xLS4zLS45MDYtLjU4Ny0xLjgxMy0uOS0yLjcxNGEuNzI3LjcyNywwLDAsMC0uMjc2LS4zMTYsMS4zLDEuMywwLDAsMC0uMzktLjE1Myw4LjUxOSw4LjUxOSwwLDAsMC0yLjE3Mi0uMjc1Yy0uOTM3LS4wMTgtMS44NzctLjAxLTIuODEzLjAzN2ExMS4xNTcsMTEuMTU3LDAsMCwwLTEuNjI3LjI0NS43MzcuNzM3LDAsMCwwLS42MTcuNDY2Yy0uMjg4Ljg3MS0uNTcsMS43NDQtLjg2MywyLjYxNC0uMDU0LjE1OSwwLC4yMTMuMTQzLjIzNi44LjEyOSwxLjU4OC4zMTMsMi4zOS4zNzYsMS4wMjEuMDgxLDIuMDQ5LjA4MSwzLjA3NC4wODZhMTYuODg1LDE2Ljg4NSwwLDAsMCwzLjA3NS0uMjg3Qy0xNDQwLjg2NCw4MzUuNzI5LTE0NDAuNTM3LDgzNS42NDUtMTQ0MC4yLDgzNS41N1ptLS41NjksMy41ODd2LS4wMjFhNi41NTMsNi41NTMsMCwwLDAsLjY2OCwwLDQuMjEyLDQuMjEyLDAsMCwwLC43Mi0uMTM4LjQxMS40MTEsMCwwLDAsLjMxOS0uNDQ4Yy0uMDA4LS4yMTEsMC0uNDIzLS4wMTMtLjYzM2EuMzU4LjM1OCwwLDAsMC0uMzQ5LS4zNzIsMS43MzcsMS43MzcsMCwwLDAtLjYyMy4wNTNjLS41NTkuMjA2LTEuMS40NDktMS42NTQuNjhhLjg2Ny44NjcsMCwwLDAtLjE2My4xLjQuNCwwLDAsMC0uMTc4LjQ0NC4zNjguMzY4LDAsMCwwLC4zNi4yODVDLTE0NDEuMzc4LDgzOS4xMzEtMTQ0MS4wNzQsODM5LjE0MS0xNDQwLjc3LDgzOS4xNTdabS04LjY0OS4wMDdjLjQtLjAyMy43MTUtLjAzNCwxLjAzLS4wNjRhLjM0OS4zNDksMCwwLDAsLjMyNS0uMjc5LjM4MS4zODEsMCwwLDAtLjE0LS40MDksMS4yMTIsMS4yMTIsMCwwLDAtLjI0OS0uMTYzYy0uNDI3LS4xOTItLjg1NC0uMzg1LTEuMjg3LS41NjFhMS44MjIsMS44MjIsMCwwLDAtLjg5LS4xNTguMzkxLjM5MSwwLDAsMC0uNC40Yy0uMDExLjIxNi0uMDA1LjQzNC0uMDA5LjY1MWEuMzc5LjM3OSwwLDAsMCwuMjIzLjM2OC45Ni45NiwwLDAsMCwuMzExLjExNEMtMTQ1MC4xMTksODM5LjEwOC0xNDQ5LjcyOSw4MzkuMTM3LTE0NDkuNDE5LDgzOS4xNjRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDUyLjU3NiAtODMwLjg2NSkiIGZpbGw9IiNmZmYiLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg0K'

const availableDriver = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCI+DQogIDxkZWZzPg0KICAgIDxmaWx0ZXIgaWQ9IkVsbGlwc2VfNTMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4NCiAgICAgIDxmZU9mZnNldCBkeT0iMyIgaW5wdXQ9IlNvdXJjZUFscGhhIi8+DQogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyLjUiIHJlc3VsdD0iYmx1ciIvPg0KICAgICAgPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMC4xNjEiLz4NCiAgICAgIDxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0iYmx1ciIvPg0KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIi8+DQogICAgPC9maWx0ZXI+DQogIDwvZGVmcz4NCiAgPGcgaWQ9ImF2YWlsYWJsZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy41IDQuNSkiPg0KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC03LjUsIC00LjUpIiBmaWx0ZXI9InVybCgjRWxsaXBzZV81MykiPg0KICAgICAgPGcgaWQ9IkVsbGlwc2VfNTMtMiIgZGF0YS1uYW1lPSJFbGxpcHNlIDUzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3LjUgNC41KSIgZmlsbD0iIzE5YTIxNCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuNSI+DQogICAgICAgIDxjaXJjbGUgY3g9IjEyLjUiIGN5PSIxMi41IiByPSIxMi41IiBzdHJva2U9Im5vbmUiLz4NCiAgICAgICAgPGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjExLjc1IiBmaWxsPSJub25lIi8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICAgIDxnIGlkPSJHcm91cF81ODciIGRhdGEtbmFtZT0iR3JvdXAgNTg3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1LjA0MyA1LjgxOCkiPg0KICAgICAgPHBhdGggaWQ9IlBhdGhfNDM1IiBkYXRhLW5hbWU9IlBhdGggNDM1IiBkPSJNLTE0NTEuNjgzLDgzNi44OWMtLjEyOCwwLS4yNzgsMC0uNDI4LDBxLS42MTMtLjAxMi0uNDE4LS42Yy4wMzUtLjEwNi4wNzEtLjIxMS4xMDgtLjMxNmEuODMyLjgzMiwwLDAsMSwuODgtLjYzM2MuNDUsMCwuNDQ2LDAsLjYtLjQyNC4zMTEtLjg1OS42MzEtMS43MTQuOTM5LTIuNTc0YTEuNTYxLDEuNTYxLDAsMCwxLC44LS44NjgsNC44OCw0Ljg4LDAsMCwxLDIuMDc0LS41NDVjLjk3OC0uMDM5LDEuOTU4LS4wNzIsMi45MzctLjA2OWE4LjA3Miw4LjA3MiwwLDAsMSwyLjc4OS4zODcsNC43NjgsNC43NjgsMCwwLDEsLjc5NS40LDEuMDUsMS4wNSwwLDAsMSwuNDI4LjU2NGMuMzYyLjk4NC43MjgsMS45NjYsMS4wODUsMi45NTEuMDQ4LjEzMi4xMDkuMTg3LjI1MS4xNzhhMi41NjQsMi41NjQsMCwwLDEsLjQ3NC4wMTIuNzYyLjc2MiwwLDAsMSwuNjM1LjQ5MSw0LjYwOCw0LjYwOCwwLDAsMSwuMTc4LjUxNC4zNjMuMzYzLDAsMCwxLS4zNi41MTljLS4xNzQuMDEzLS4zNSwwLS41NTUsMGE0LjQ4Niw0LjQ4NiwwLDAsMSwuMTQ0LjQ3MywyLjY5MSwyLjY5MSwwLDAsMSwuMDQyLjQ4OXEwLDIuMjEsMCw0LjQyYS41NDguNTQ4LDAsMCwxLS42MjcuNjIyaC0xLjc3OWEuNTU2LjU1NiwwLDAsMS0uNjI5LS42MTFjLS4wMDctLjIyMy0uMDEyLS40NDcsMC0uNjY5LjAxLS4xNzMtLjA1My0uMjE2LS4yMi0uMjE2LTEuODcyLjAwNS0zLjc0NSwwLTUuNjE4LDAtLjQ4MSwwLS45NjMuMDA2LTEuNDQ0LDAtLjE1OSwwLS4yLjA1Mi0uMi4yLjAxMS4yMjMuMDA3LjQ0NiwwLC42NjlhLjU2LjU2LDAsMCwxLS42MzUuNjI0cS0uOTA3LDAtMS44MTQsMGEuNTM3LjUzNywwLDAsMS0uNTg3LS41OTFjMC0xLjUtLjAwOC0yLjk5NC4wMDYtNC40OTFBNi42LDYuNiwwLDAsMS0xNDUxLjY4Myw4MzYuODlabTExLjQ4Mi0xLjMyYy0uMDExLS4wNTQtLjAxMy0uMDc2LS4wMi0uMS0uMy0uOTA2LS41ODctMS44MTMtLjktMi43MTRhLjcyNy43MjcsMCwwLDAtLjI3Ni0uMzE2LDEuMywxLjMsMCwwLDAtLjM5LS4xNTMsOC41MTksOC41MTksMCwwLDAtMi4xNzItLjI3NWMtLjkzNy0uMDE4LTEuODc3LS4wMS0yLjgxMy4wMzdhMTEuMTU3LDExLjE1NywwLDAsMC0xLjYyNy4yNDUuNzM3LjczNywwLDAsMC0uNjE3LjQ2NmMtLjI4OC44NzEtLjU3LDEuNzQ0LS44NjMsMi42MTQtLjA1NC4xNTksMCwuMjEzLjE0My4yMzYuOC4xMjksMS41ODguMzEzLDIuMzkuMzc2LDEuMDIxLjA4MSwyLjA0OS4wODEsMy4wNzQuMDg2YTE2Ljg4NSwxNi44ODUsMCwwLDAsMy4wNzUtLjI4N0MtMTQ0MC44NjQsODM1LjcyOS0xNDQwLjUzNyw4MzUuNjQ1LTE0NDAuMiw4MzUuNTdabS0uNTY5LDMuNTg3di0uMDIxYTYuNTUzLDYuNTUzLDAsMCwwLC42NjgsMCw0LjIxMiw0LjIxMiwwLDAsMCwuNzItLjEzOC40MTEuNDExLDAsMCwwLC4zMTktLjQ0OGMtLjAwOC0uMjExLDAtLjQyMy0uMDEzLS42MzNhLjM1OC4zNTgsMCwwLDAtLjM0OS0uMzcyLDEuNzM3LDEuNzM3LDAsMCwwLS42MjMuMDUzYy0uNTU5LjIwNi0xLjEuNDQ5LTEuNjU0LjY4YS44NjcuODY3LDAsMCwwLS4xNjMuMS40LjQsMCwwLDAtLjE3OC40NDQuMzY4LjM2OCwwLDAsMCwuMzYuMjg1Qy0xNDQxLjM3OCw4MzkuMTMxLTE0NDEuMDc0LDgzOS4xNDEtMTQ0MC43Nyw4MzkuMTU3Wm0tOC42NDkuMDA3Yy40LS4wMjMuNzE1LS4wMzQsMS4wMy0uMDY0YS4zNDkuMzQ5LDAsMCwwLC4zMjUtLjI3OS4zODEuMzgxLDAsMCwwLS4xNC0uNDA5LDEuMjEyLDEuMjEyLDAsMCwwLS4yNDktLjE2M2MtLjQyNy0uMTkyLS44NTQtLjM4NS0xLjI4Ny0uNTYxYTEuODIyLDEuODIyLDAsMCwwLS44OS0uMTU4LjM5MS4zOTEsMCwwLDAtLjQuNGMtLjAxMS4yMTYtLjAwNS40MzQtLjAwOS42NTFhLjM3OS4zNzksMCwwLDAsLjIyMy4zNjguOTYuOTYsMCwwLDAsLjMxMS4xMTRDLTE0NTAuMTE5LDgzOS4xMDgtMTQ0OS43MjksODM5LjEzNy0xNDQ5LjQxOSw4MzkuMTY0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ1Mi41NzYgLTgzMC44NjUpIiBmaWxsPSIjZmZmIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg=='

const inactiveDriver = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCI+DQogIDxkZWZzPg0KICAgIDxmaWx0ZXIgaWQ9IkVsbGlwc2VfNTMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4NCiAgICAgIDxmZU9mZnNldCBkeT0iMyIgaW5wdXQ9IlNvdXJjZUFscGhhIi8+DQogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyLjUiIHJlc3VsdD0iYmx1ciIvPg0KICAgICAgPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMC4xNjEiLz4NCiAgICAgIDxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0iYmx1ciIvPg0KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIi8+DQogICAgPC9maWx0ZXI+DQogIDwvZGVmcz4NCiAgPGcgaWQ9IkNvbXBvbmVudF8yMjNfMjIiIGRhdGEtbmFtZT0iQ29tcG9uZW50IDIyMyDigJMgMjIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuNSA0LjUpIj4NCiAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNy41LCAtNC41KSIgZmlsdGVyPSJ1cmwoI0VsbGlwc2VfNTMpIj4NCiAgICAgIDxnIGlkPSJFbGxpcHNlXzUzLTIiIGRhdGEtbmFtZT0iRWxsaXBzZSA1MyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy41IDQuNSkiIGZpbGw9IiM3ZDdkN2QiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiPg0KICAgICAgICA8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTIuNSIgcj0iMTIuNSIgc3Ryb2tlPSJub25lIi8+DQogICAgICAgIDxjaXJjbGUgY3g9IjEyLjUiIGN5PSIxMi41IiByPSIxMS43NSIgZmlsbD0ibm9uZSIvPg0KICAgICAgPC9nPg0KICAgIDwvZz4NCiAgICA8ZyBpZD0iR3JvdXBfNTg3IiBkYXRhLW5hbWU9Ikdyb3VwIDU4NyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4wNDMgNS44MTgpIj4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzQzNSIgZGF0YS1uYW1lPSJQYXRoIDQzNSIgZD0iTS0xNDUxLjY4Myw4MzYuODljLS4xMjgsMC0uMjc4LDAtLjQyOCwwcS0uNjEzLS4wMTItLjQxOC0uNmMuMDM1LS4xMDYuMDcxLS4yMTEuMTA4LS4zMTZhLjgzMi44MzIsMCwwLDEsLjg4LS42MzNjLjQ1LDAsLjQ0NiwwLC42LS40MjQuMzExLS44NTkuNjMxLTEuNzE0LjkzOS0yLjU3NGExLjU2MSwxLjU2MSwwLDAsMSwuOC0uODY4LDQuODgsNC44OCwwLDAsMSwyLjA3NC0uNTQ1Yy45NzgtLjAzOSwxLjk1OC0uMDcyLDIuOTM3LS4wNjlhOC4wNzIsOC4wNzIsMCwwLDEsMi43ODkuMzg3LDQuNzY4LDQuNzY4LDAsMCwxLC43OTUuNCwxLjA1LDEuMDUsMCwwLDEsLjQyOC41NjRjLjM2Mi45ODQuNzI4LDEuOTY2LDEuMDg1LDIuOTUxLjA0OC4xMzIuMTA5LjE4Ny4yNTEuMTc4YTIuNTY0LDIuNTY0LDAsMCwxLC40NzQuMDEyLjc2Mi43NjIsMCwwLDEsLjYzNS40OTEsNC42MDgsNC42MDgsMCwwLDEsLjE3OC41MTQuMzYzLjM2MywwLDAsMS0uMzYuNTE5Yy0uMTc0LjAxMy0uMzUsMC0uNTU1LDBhNC40ODYsNC40ODYsMCwwLDEsLjE0NC40NzMsMi42OTEsMi42OTEsMCwwLDEsLjA0Mi40ODlxMCwyLjIxLDAsNC40MmEuNTQ4LjU0OCwwLDAsMS0uNjI3LjYyMmgtMS43NzlhLjU1Ni41NTYsMCwwLDEtLjYyOS0uNjExYy0uMDA3LS4yMjMtLjAxMi0uNDQ3LDAtLjY2OS4wMS0uMTczLS4wNTMtLjIxNi0uMjItLjIxNi0xLjg3Mi4wMDUtMy43NDUsMC01LjYxOCwwLS40ODEsMC0uOTYzLjAwNi0xLjQ0NCwwLS4xNTksMC0uMi4wNTItLjIuMi4wMTEuMjIzLjAwNy40NDYsMCwuNjY5YS41Ni41NiwwLDAsMS0uNjM1LjYyNHEtLjkwNywwLTEuODE0LDBhLjUzNy41MzcsMCwwLDEtLjU4Ny0uNTkxYzAtMS41LS4wMDgtMi45OTQuMDA2LTQuNDkxQTYuNiw2LjYsMCwwLDEtMTQ1MS42ODMsODM2Ljg5Wm0xMS40ODItMS4zMmMtLjAxMS0uMDU0LS4wMTMtLjA3Ni0uMDItLjEtLjMtLjkwNi0uNTg3LTEuODEzLS45LTIuNzE0YS43MjcuNzI3LDAsMCwwLS4yNzYtLjMxNiwxLjMsMS4zLDAsMCwwLS4zOS0uMTUzLDguNTE5LDguNTE5LDAsMCwwLTIuMTcyLS4yNzVjLS45MzctLjAxOC0xLjg3Ny0uMDEtMi44MTMuMDM3YTExLjE1NywxMS4xNTcsMCwwLDAtMS42MjcuMjQ1LjczNy43MzcsMCwwLDAtLjYxNy40NjZjLS4yODguODcxLS41NywxLjc0NC0uODYzLDIuNjE0LS4wNTQuMTU5LDAsLjIxMy4xNDMuMjM2LjguMTI5LDEuNTg4LjMxMywyLjM5LjM3NiwxLjAyMS4wODEsMi4wNDkuMDgxLDMuMDc0LjA4NmExNi44ODUsMTYuODg1LDAsMCwwLDMuMDc1LS4yODdDLTE0NDAuODY0LDgzNS43MjktMTQ0MC41MzcsODM1LjY0NS0xNDQwLjIsODM1LjU3Wm0tLjU2OSwzLjU4N3YtLjAyMWE2LjU1Myw2LjU1MywwLDAsMCwuNjY4LDAsNC4yMTIsNC4yMTIsMCwwLDAsLjcyLS4xMzguNDExLjQxMSwwLDAsMCwuMzE5LS40NDhjLS4wMDgtLjIxMSwwLS40MjMtLjAxMy0uNjMzYS4zNTguMzU4LDAsMCwwLS4zNDktLjM3MiwxLjczNywxLjczNywwLDAsMC0uNjIzLjA1M2MtLjU1OS4yMDYtMS4xLjQ0OS0xLjY1NC42OGEuODY3Ljg2NywwLDAsMC0uMTYzLjEuNC40LDAsMCwwLS4xNzguNDQ0LjM2OC4zNjgsMCwwLDAsLjM2LjI4NUMtMTQ0MS4zNzgsODM5LjEzMS0xNDQxLjA3NCw4MzkuMTQxLTE0NDAuNzcsODM5LjE1N1ptLTguNjQ5LjAwN2MuNC0uMDIzLjcxNS0uMDM0LDEuMDMtLjA2NGEuMzQ5LjM0OSwwLDAsMCwuMzI1LS4yNzkuMzgxLjM4MSwwLDAsMC0uMTQtLjQwOSwxLjIxMiwxLjIxMiwwLDAsMC0uMjQ5LS4xNjNjLS40MjctLjE5Mi0uODU0LS4zODUtMS4yODctLjU2MWExLjgyMiwxLjgyMiwwLDAsMC0uODktLjE1OC4zOTEuMzkxLDAsMCwwLS40LjRjLS4wMTEuMjE2LS4wMDUuNDM0LS4wMDkuNjUxYS4zNzkuMzc5LDAsMCwwLC4yMjMuMzY4Ljk2Ljk2LDAsMCwwLC4zMTEuMTE0Qy0xNDUwLjExOSw4MzkuMTA4LTE0NDkuNzI5LDgzOS4xMzctMTQ0OS40MTksODM5LjE2NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NTIuNTc2IC04MzAuODY1KSIgZmlsbD0iI2ZmZiIvPg0KICAgIDwvZz4NCiAgPC9nPg0KPC9zdmc+DQo='

const deliveringDriver = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCI+DQogIDxkZWZzPg0KICAgIDxmaWx0ZXIgaWQ9IkVsbGlwc2VfNTMiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4NCiAgICAgIDxmZU9mZnNldCBkeT0iMyIgaW5wdXQ9IlNvdXJjZUFscGhhIi8+DQogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyLjUiIHJlc3VsdD0iYmx1ciIvPg0KICAgICAgPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMC4xNjEiLz4NCiAgICAgIDxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0iYmx1ciIvPg0KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIi8+DQogICAgPC9maWx0ZXI+DQogIDwvZGVmcz4NCiAgPGcgaWQ9ImRlbGl2ZXJpbmciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuNSA0LjUpIj4NCiAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNy41LCAtNC41KSIgZmlsdGVyPSJ1cmwoI0VsbGlwc2VfNTMpIj4NCiAgICAgIDxnIGlkPSJFbGxpcHNlXzUzLTIiIGRhdGEtbmFtZT0iRWxsaXBzZSA1MyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy41IDQuNSkiIGZpbGw9IiNmZmE2MzEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiPg0KICAgICAgICA8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTIuNSIgcj0iMTIuNSIgc3Ryb2tlPSJub25lIi8+DQogICAgICAgIDxjaXJjbGUgY3g9IjEyLjUiIGN5PSIxMi41IiByPSIxMS43NSIgZmlsbD0ibm9uZSIvPg0KICAgICAgPC9nPg0KICAgIDwvZz4NCiAgICA8ZyBpZD0iR3JvdXBfNTg3IiBkYXRhLW5hbWU9Ikdyb3VwIDU4NyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4wNDMgNS44MTgpIj4NCiAgICAgIDxwYXRoIGlkPSJQYXRoXzQzNSIgZGF0YS1uYW1lPSJQYXRoIDQzNSIgZD0iTS0xNDUxLjY4Myw4MzYuODljLS4xMjgsMC0uMjc4LDAtLjQyOCwwcS0uNjEzLS4wMTItLjQxOC0uNmMuMDM1LS4xMDYuMDcxLS4yMTEuMTA4LS4zMTZhLjgzMi44MzIsMCwwLDEsLjg4LS42MzNjLjQ1LDAsLjQ0NiwwLC42LS40MjQuMzExLS44NTkuNjMxLTEuNzE0LjkzOS0yLjU3NGExLjU2MSwxLjU2MSwwLDAsMSwuOC0uODY4LDQuODgsNC44OCwwLDAsMSwyLjA3NC0uNTQ1Yy45NzgtLjAzOSwxLjk1OC0uMDcyLDIuOTM3LS4wNjlhOC4wNzIsOC4wNzIsMCwwLDEsMi43ODkuMzg3LDQuNzY4LDQuNzY4LDAsMCwxLC43OTUuNCwxLjA1LDEuMDUsMCwwLDEsLjQyOC41NjRjLjM2Mi45ODQuNzI4LDEuOTY2LDEuMDg1LDIuOTUxLjA0OC4xMzIuMTA5LjE4Ny4yNTEuMTc4YTIuNTY0LDIuNTY0LDAsMCwxLC40NzQuMDEyLjc2Mi43NjIsMCwwLDEsLjYzNS40OTEsNC42MDgsNC42MDgsMCwwLDEsLjE3OC41MTQuMzYzLjM2MywwLDAsMS0uMzYuNTE5Yy0uMTc0LjAxMy0uMzUsMC0uNTU1LDBhNC40ODYsNC40ODYsMCwwLDEsLjE0NC40NzMsMi42OTEsMi42OTEsMCwwLDEsLjA0Mi40ODlxMCwyLjIxLDAsNC40MmEuNTQ4LjU0OCwwLDAsMS0uNjI3LjYyMmgtMS43NzlhLjU1Ni41NTYsMCwwLDEtLjYyOS0uNjExYy0uMDA3LS4yMjMtLjAxMi0uNDQ3LDAtLjY2OS4wMS0uMTczLS4wNTMtLjIxNi0uMjItLjIxNi0xLjg3Mi4wMDUtMy43NDUsMC01LjYxOCwwLS40ODEsMC0uOTYzLjAwNi0xLjQ0NCwwLS4xNTksMC0uMi4wNTItLjIuMi4wMTEuMjIzLjAwNy40NDYsMCwuNjY5YS41Ni41NiwwLDAsMS0uNjM1LjYyNHEtLjkwNywwLTEuODE0LDBhLjUzNy41MzcsMCwwLDEtLjU4Ny0uNTkxYzAtMS41LS4wMDgtMi45OTQuMDA2LTQuNDkxQTYuNiw2LjYsMCwwLDEtMTQ1MS42ODMsODM2Ljg5Wm0xMS40ODItMS4zMmMtLjAxMS0uMDU0LS4wMTMtLjA3Ni0uMDItLjEtLjMtLjkwNi0uNTg3LTEuODEzLS45LTIuNzE0YS43MjcuNzI3LDAsMCwwLS4yNzYtLjMxNiwxLjMsMS4zLDAsMCwwLS4zOS0uMTUzLDguNTE5LDguNTE5LDAsMCwwLTIuMTcyLS4yNzVjLS45MzctLjAxOC0xLjg3Ny0uMDEtMi44MTMuMDM3YTExLjE1NywxMS4xNTcsMCwwLDAtMS42MjcuMjQ1LjczNy43MzcsMCwwLDAtLjYxNy40NjZjLS4yODguODcxLS41NywxLjc0NC0uODYzLDIuNjE0LS4wNTQuMTU5LDAsLjIxMy4xNDMuMjM2LjguMTI5LDEuNTg4LjMxMywyLjM5LjM3NiwxLjAyMS4wODEsMi4wNDkuMDgxLDMuMDc0LjA4NmExNi44ODUsMTYuODg1LDAsMCwwLDMuMDc1LS4yODdDLTE0NDAuODY0LDgzNS43MjktMTQ0MC41MzcsODM1LjY0NS0xNDQwLjIsODM1LjU3Wm0tLjU2OSwzLjU4N3YtLjAyMWE2LjU1Myw2LjU1MywwLDAsMCwuNjY4LDAsNC4yMTIsNC4yMTIsMCwwLDAsLjcyLS4xMzguNDExLjQxMSwwLDAsMCwuMzE5LS40NDhjLS4wMDgtLjIxMSwwLS40MjMtLjAxMy0uNjMzYS4zNTguMzU4LDAsMCwwLS4zNDktLjM3MiwxLjczNywxLjczNywwLDAsMC0uNjIzLjA1M2MtLjU1OS4yMDYtMS4xLjQ0OS0xLjY1NC42OGEuODY3Ljg2NywwLDAsMC0uMTYzLjEuNC40LDAsMCwwLS4xNzguNDQ0LjM2OC4zNjgsMCwwLDAsLjM2LjI4NUMtMTQ0MS4zNzgsODM5LjEzMS0xNDQxLjA3NCw4MzkuMTQxLTE0NDAuNzcsODM5LjE1N1ptLTguNjQ5LjAwN2MuNC0uMDIzLjcxNS0uMDM0LDEuMDMtLjA2NGEuMzQ5LjM0OSwwLDAsMCwuMzI1LS4yNzkuMzgxLjM4MSwwLDAsMC0uMTQtLjQwOSwxLjIxMiwxLjIxMiwwLDAsMC0uMjQ5LS4xNjNjLS40MjctLjE5Mi0uODU0LS4zODUtMS4yODctLjU2MWExLjgyMiwxLjgyMiwwLDAsMC0uODktLjE1OC4zOTEuMzkxLDAsMCwwLS40LjRjLS4wMTEuMjE2LS4wMDUuNDM0LS4wMDkuNjUxYS4zNzkuMzc5LDAsMCwwLC4yMjMuMzY4Ljk2Ljk2LDAsMCwwLC4zMTEuMTE0Qy0xNDUwLjExOSw4MzkuMTA4LTE0NDkuNzI5LDgzOS4xMzctMTQ0OS40MTksODM5LjE2NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0NTIuNTc2IC04MzAuODY1KSIgZmlsbD0iI2ZmZiIvPg0KICAgIDwvZz4NCiAgPC9nPg0KPC9zdmc+DQo='

export {assignedDriver, availableDriver, inactiveDriver, deliveringDriver}