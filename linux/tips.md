## Execute a binary like Cron would do:

```
env -i /bin/sh -c '/ruta/al/binario --options'
```

If minimal variables are needed:
```
env -i PATH=/usr/bin:/bin HOME=/home/user /bin/sh -c '/ruta/al/binario --opciones'
```
