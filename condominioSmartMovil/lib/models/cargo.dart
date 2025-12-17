class Cargo {
  final int id;
  final String concepto;
  final double monto;
  final String? fechaVencimiento;
  final String estado;
  final String? descripcion;
  
  Cargo({
    required this.id,
    required this.concepto,
    required this.monto,
    this.fechaVencimiento,
    this.estado = 'pendiente',
    this.descripcion,
  });
  
  factory Cargo.fromJson(Map<String, dynamic> json) {
    return Cargo(
      id: json['id'],
      concepto: json['concepto'],
      monto: double.parse(json['monto'].toString()),
      fechaVencimiento: json['fecha_vencimiento'],
      estado: json['estado'] ?? 'pendiente',
      descripcion: json['descripcion'],
    );
  }
  
  bool get isPendiente => estado == 'pendiente';
  bool get isVencido {
    if (fechaVencimiento == null) return false;
    final vencimiento = DateTime.parse(fechaVencimiento!);
    return vencimiento.isBefore(DateTime.now()) && isPendiente;
  }
}
