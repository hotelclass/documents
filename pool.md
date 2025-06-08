# Piscina del último piso X
```yaml
properties:
  audience: huéspedes
  role: general

functions:
  - name: reserve
    description: Reservar piscina
    parameters:
      - name: day
        type: string
        required: true
    endpoint: https://api.hotelclass.com/pool/reserve
```
## Horarios
La piscina está disponible de 8:00 a 22:00 todos los días.  
Por razones de mantenimiento, puede haber cierres ocasionales los miércoles por la tarde.


# Piscina del último piso REPEAT X
```yaml
audience: personal
role: mantenimiento
```

## Normas de uso
Es obligatorio ducharse antes de ingresar.  
No se permite ingresar comida ni bebidas alcohólicas.  
Niños menores deben estar acompañados por un adulto.


# Piscina del último piso X
```yaml
audience: personal
role: mantenimiento
```
## Mantenimiento diario
El proceso de limpieza comienza a las 5:00 y debe finalizar antes de las 7:30.  
Utilizar únicamente productos aprobados por la administración.

# Piscina para niños X
```yaml
audience: huéspedes
role: general
```

## Reglas de seguridad
El uso de flotadores está permitido solo en la zona infantil.  
Un socorrista estará presente de 10:00 a 18:00.  
Evitar correr en el área circundante a la piscina.

