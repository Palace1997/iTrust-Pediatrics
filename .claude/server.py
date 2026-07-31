import functools
import http.server
import os
import socketserver

DIRECTORY = "/Users/eddmaar/Documents/Pediatrics web"
PORT = int(os.environ.get("PORT", "4321"))

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIRECTORY)

socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
