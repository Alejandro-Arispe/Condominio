class Comunicado {
  final int id;
  final String titulo;
  final String contenido;
  final String? fechaPublicacion;
  final bool leido;
  
  Comunicado({
    required this.id,
    required this.titulo,
    required this.contenido,
    this.fechaPublicacion,
    this.leido = false,
  });
  
  factory Comunicado.fromJson(Map<String, dynamic> json) {
    return Comunicado(
      id: json['id'],
      titulo: json['titulo'],
      contenido: json['contenido'],
      fechaPublicacion: json['fecha_publicacion'],
      leido: json['leido'] ?? false,
    );
  }
}
