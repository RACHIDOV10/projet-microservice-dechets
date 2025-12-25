import consul
from conf.config import *

consul_client = consul.Consul(
    host=CONSUL_HOST,
    port=CONSUL_PORT
)

def register():
    consul_client.agent.service.register(
        name=SERVICE_NAME,
        service_id=SERVICE_ID,
        address=SERVICE_HOST,
        port=SERVICE_PORT,
        check=consul.Check.http(
            url=f"http://{SERVICE_HOST}:{SERVICE_PORT}/",
            interval="10s"
        )
    )

def deregister():
    consul_client.agent.service.deregister(SERVICE_ID)
