# WebSockets-Front Serverless - AWS Node.js Typescript

Hola a todos, a continuación les dejo un par de notas sobre el funcionamiento, errores que tuve sobre el desarrollo y los tropiezos que surgieron.

## Funcionamiento del front


**Importaciones de módulos:**
Se importan los módulos necesarios de *aws-lambda*, *aws-sd*k y *uuid* para trabajar con AWS Lambda, AWS SDK y generar identificadores únicos, respectivamente.

**Definición de tipos:**
Se definen varios tipos TypeScript para mejorar la legibilidad y la seguridad del código, como *Action* para las acciones que puede realizar la aplicación, Client para representar a un *cliente* conectado y varios tipos de cuerpo de mensajes (*SendMessageBody*, *GetMessagesBody*).

**Constantes y objetos de AWS:**
Se definen constantes para los nombres de las tablas de DynamoDB y se crea un cliente *docClient* para interactuar con DynamoDB. También se crea un cliente *apigw* para la gestión de la API de WebSocket de API Gateway.

**Manejo de errores:**
Se define una clase *HandlerError* que extiende de Error para manejar errores específicos en la lógica del manejador de Lambda.

**Función principal *handle*:**
Esta función es el punto de entrada de la Lambda. Maneja las diferentes acciones según el tipo de mensaje recibido a través del WebSocket, como la conexión, desconexión, obtención de clientes, envío de mensajes y obtención de mensajes.

**Funciones de manejo de acciones:**
Se definen funciones para manejar cada acción específica, como handleConnect para manejar la conexión de un cliente, *handleDisconnect* para manejar la desconexión, *handleGetClients* para obtener la lista de clientes conectados, *handleSendMessage* para enviar un mensaje a otro cliente y *handleGetMessages* para obtener mensajes entre clientes.

**Funciones de utilidad:**
Se definen varias funciones de utilidad, como *notifyClientChange* para notificar cambios a todos los clientes conectados, *getAllClients* para obtener todos los clientes de la base de datos, *postToConnection* para enviar mensajes a clientes a través de la API de WebSocket y otras funciones para manejar operaciones relacionadas con la base de datos *DynamoDB*.

## Para hacer pruebas mediante un CLI
Se pueden realizar un par de pruebas utilizando **WSCAT CLI**

*wscat -c wss://eex5p2uf7d.execute-api.us-east-1.amazonaws.com/dev?nickname=Carlos*

Yo utilicé el nockname "Carlos" como ejemplo, ya que hay un par de registros y chats con otro usuario, igualmente se puede utilizar el usuario "BigFoot" xD.

Y para realizar un chat mas o menos en orden, se puede utilizar:

*{"action":"sendMessage","message":"Hi","recipientNickname":"Carlos"}*]

En donde "recipientNickname" será el destinatario del mensaje.

# Funcionalidades de la configuracion Serverless:

**Variables de entorno:**
*Se define la variable de entorno WSSAPIGATEWAYENDPOINT para la dirección del endpoint de la API de WebSockets. Esta variable se forma utilizando funciones de AWS CloudFormation para obtener la referencia a la API de WebSockets y el nombre de la región y el stage de despliegue.

**Configuración IAM:**
*Se establecen los permisos necesarios para acceder y manipular las tablas de DynamoDB. Esto incluye permisos para operaciones como PutItem, GetItem, DeleteItem, Scan y Query en las tablas de clientes (ClientsTable) y mensajes (MessagesTable).

**Función Lambda websocketHandler:**
* Se define la función Lambda websocketHandler y se especifica el manejador src/handlers.handle para procesar las solicitudes WebSocket.
* Se configuran los eventos de WebSocket para las diferentes rutas ($connect, $disconnect, getMessages, sendMessage, getClients).

## Errores de desarrollo:
Respecto a los errores, me topé con importaciones incorrectas, erorres en tipos de datos y sobre todo problemas con las versiones en mi entorno de desarrollo, pero nada grave en esta parte del proyecto.

## Tropiezos:
Respecto a los tropiezos que surgieron, fue el conseguir un CLI para poder utilizar serverless, probé con descargas, comandos raros en powrshell y cmd, hasta que me di cuenta que existe un CLI de Amazon AWS o en este caso, WSCAT CLI, descubrí este último primero, por lo que no utilicé el CLI de AWS.

### Notas finales:
Otro reto fue el utilizar los servicios de AWS, ya que en anteriores ocasiones ya había estudiado sobre los servicios que opfrecen, popr lo que cuento con cierta teoría, pero no con práctica. En esta prueba pude poder a prueba estos conocimientos, pero si me las vi bastante apretadas para poder realizar ciertas funcionalidades y configuraciones de AWS, me basé en los cursos que estudié, algunas prácticas que realicé en la universidad con Docker, documentación y posts de Stackoverflow.
