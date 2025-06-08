# Clarice Restaurant
```yaml
properties:
  audience: guest
  role: all

functions:
  - name: getMenu
    description: Menú del día
    parameters:
      - name: day
        type: string
        required: true
    endpoint: https://api.hotelclass.com/claricemenu
```
## Horarios
El Restaurante permanecerá abierto todos los días desde las 8:30 hasta las 22 horas.  

##Menu Promocional
Incluye copa de vino o gaseosa y café.
Lunes: Pollo al horno con papas.
Martes: Carré de cerdo con puré de manzanas
Miércoles: Ensalada Waldorf
Jueves: Feijuada
Viernes: Pescado
Sábado: Mariscos

