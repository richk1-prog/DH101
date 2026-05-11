import base64
import os

b64 = """
PUT_BASE64_HERE
"""

out = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'make4.gif')
with open(out, 'wb') as f:
    f.write(base64.b64decode(b64))
print('wrote', out)
