class Reserva {
  final int id;
  final String areaNombre;
  final String fechaInicio;
  final String fechaFin;
  final String estado;
  final double? monto;
  
  Reserva({
    required this.id,
    required this.areaNombre,
    required this.fechaInicio,
    required this.fechaFin,
    required this.estado,
    this.monto,
  });
  
  factory Reserva.fromJson(Map<String, dynamic> json) {
    return Reserva(
      id: json['id'],
      areaNombre: json['area_comun']?['nombre'] ?? json['area_nombre'] ?? 'Área',
      fechaInicio: json['fecha_inicio'],
      fechaFin: json['fecha_fin'],
      estado: json['estado'] ?? 'pendiente',
      monto: json['monto'] != null ? double.parse(json['monto'].toString()) : null,
    );
  }
  
  bool get isPendiente => estado == 'pendiente';
  bool get isConfirmada => estado == 'confirmada';
  bool get isCancelada => estado == 'cancelada';
}
