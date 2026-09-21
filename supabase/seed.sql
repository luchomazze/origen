begin;

insert into public.listings (
  id, tipo, titulo, slug, descripcion, precio, moneda, precio_desde,
  estado_publicacion, estado_comercial, ciudad, barrio, direccion,
  latitud, longitud, superficie_m2, tipo_propiedad, dormitorios, banos,
  cocheras, ambientes, apto_credito, fecha_entrega, financiamiento,
  services
) values
('p1', 'PROPIEDAD', 'Casa en Manantiales', 'casa-en-manantiales-p1', 'Amplia casa en uno de los barrios más consolidados de Córdoba Sur. Planta baja y primer piso con amplios espacios, jardín y cochera cubierta.', 245000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Manantiales', null, -31.46, -64.22, 185, 'CASA', 3, 2, 2, 5, false, null, null, array['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet']),
('p2', 'PROPIEDAD', 'Departamento en Barrio Jardín', 'departamento-barrio-jardin-p2', 'Departamento luminoso con balcón orientado al norte. Edificio con amenities. Ideal para inversión o vivienda propia.', 118000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Barrio Jardín', null, -31.40, -64.18, 78, 'DEPARTAMENTO', 2, 1, 1, 3, true, null, null, array['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet', 'Fibra óptica']),
('p3', 'PROPIEDAD', 'Casa en Jardines del Jockey', 'casa-jardines-del-jockey-p3', 'Casa de categoría en barrio cerrado con acceso controlado. Amplio jardín, pileta y terminaciones de primera calidad.', 380000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Jardines del Jockey', null, -31.44, -64.20, 280, 'CASA', 4, 3, 2, 7, false, null, null, array[]::text[]),
('p4', 'PROPIEDAD', 'PH en Camino San Carlos', 'ph-camino-san-carlos-p4', 'PH en planta alta con terraza propia. Diseño moderno, cocina integrada y excelente iluminación natural.', 85000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Camino San Carlos', null, -31.50, -64.25, 52, 'PH', 1, 1, 1, 2, true, null, null, array[]::text[]),
('p5', 'PROPIEDAD', 'Casa en Manantiales', 'casa-manantiales-p5', 'Residencia de categoría superior en Manantiales. Amplísimos espacios interiores y exteriores.', 520000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Manantiales', null, -31.46, -64.23, 340, 'CASA', 5, 4, 3, 9, false, null, null, array[]::text[]),
('p6', 'PROPIEDAD', 'Departamento en Barrio Jardín', 'departamento-barrio-jardin-p6', 'Departamento de 3 ambientes en edificio de categoría. Se encuentra reservado — consultá disponibilidad.', 175000, 'USD', false, 'PUBLICADO', 'RESERVADO', 'Córdoba', 'Barrio Jardín', null, -31.41, -64.19, 110, 'DEPARTAMENTO', 3, 2, 1, 4, true, null, null, array[]::text[]),
('p7', 'PROPIEDAD', 'Casa en Jardines del Jockey', 'casa-jardines-del-jockey-p7', 'Casa en uno de los barrios más buscados del sur de la ciudad. Buen estado de conservación.', 295000, 'USD', false, 'PUBLICADO', 'EN_NEGOCIACION', 'Córdoba', 'Jardines del Jockey', null, -31.45, -64.21, 210, 'CASA', 3, 2, 2, 6, false, null, null, array[]::text[]),
('p8', 'PROPIEDAD', 'Departamento en Camino San Carlos', 'departamento-camino-san-carlos-p8', 'Departamento de 2 dormitorios en un complejo tranquilo con amplios espacios verdes.', 138000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Camino San Carlos', null, -31.51, -64.26, 88, 'DEPARTAMENTO', 2, 2, 1, 3, true, null, null, array[]::text[]),
('t1', 'TERRENO', 'Lote en Manantiales', 'lote-manantiales-t1', 'Lote en ubicación privilegiada dentro de Manantiales. Todos los servicios disponibles.', 42000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Manantiales', null, -31.47, -64.22, 600, null, null, null, null, null, null, null, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural']),
('t2', 'TERRENO', 'Lote en Barrio Jardín', 'lote-barrio-jardin-t2', 'Terreno en Barrio Jardín, zona consolidada y con fácil acceso.', 35000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Barrio Jardín', null, -31.41, -64.18, 450, null, null, null, null, null, null, null, null, array['Agua corriente', 'Electricidad']),
('t3', 'TERRENO', 'Loteo Los Álamos', 'loteo-los-alamos-t3', 'Loteo residencial en Docta, una de las zonas de mayor crecimiento de Córdoba Sur. Lotes de diferentes medidas con todos los servicios.', 35000, 'USD', true, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Docta', null, -31.52, -64.28, null, null, null, null, null, null, null, null, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural', 'Internet']),
('t4', 'TERRENO', 'Terreno en Jardines del Jockey', 'terreno-jardines-del-jockey-t4', 'Terreno amplio en zona residencial consolidada.', 55000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Jardines del Jockey', null, -31.44, -64.20, 800, null, null, null, null, null, null, null, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Seguridad']),
('t5', 'TERRENO', 'Terreno en Manantiales', 'terreno-manantiales-t5', 'Gran terreno en Manantiales con excelente ubicación y frente generoso.', 72000, 'USD', false, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Manantiales', null, -31.48, -64.23, 950, null, null, null, null, null, null, null, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural', 'Internet', 'Fibra óptica']),
('e1', 'EMPRENDIMIENTO', 'Origen Park', 'origen-park', 'Un nuevo concepto residencial en el corazón de Manantiales. Proyecto pensado para quienes buscan combinar calidad de vida, ubicación y una oportunidad de inversión. Arquitectura contemporánea que prioriza la luz natural y los espacios bien resueltos.', 75000, 'USD', true, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Manantiales', 'Manantiales, Córdoba Sur', -31.46, -64.22, null, null, null, null, null, null, null, 'Diciembre 2028', 'Anticipo del 30% + cuotas en pesos ajustadas por índice. Datos de carácter demostrativo.', array['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet', 'Fibra óptica', 'Seguridad']),
('e2', 'EMPRENDIMIENTO', 'Altos del Sur', 'altos-del-sur', 'Un proyecto de gran escala que redefine el horizonte residencial en la zona sur de Córdoba. Vistas panorámicas únicas y unidades amplias diseñadas para quienes buscan una vivienda de calidad o una inversión de largo plazo.', 95000, 'USD', true, 'PUBLICADO', 'DISPONIBLE', 'Córdoba', 'Córdoba Sur', 'Zona Sur, Córdoba', -31.49, -64.25, null, null, null, null, null, null, null, 'Junio 2027', 'Anticipo del 25% + cuotas en pesos. Datos de carácter demostrativo.', array[]::text[]),
('e3', 'EMPRENDIMIENTO', 'La Arboleda', 'la-arboleda', 'Proyecto finalizado y entregado. Un entorno natural privilegiado con unidades diseñadas para quienes priorizan calidad de vida. Unidades disponibles para entrega inmediata.', 135000, 'USD', true, 'PUBLICADO', 'EN_NEGOCIACION', 'Córdoba', 'Camino San Carlos', 'Camino San Carlos, Córdoba Sur', -31.51, -64.27, null, null, null, null, null, null, null, 'Entregado', null, array[]::text[])
on conflict (id) do update set
  tipo = excluded.tipo,
  titulo = excluded.titulo,
  slug = excluded.slug,
  descripcion = excluded.descripcion,
  precio = excluded.precio,
  moneda = excluded.moneda,
  precio_desde = excluded.precio_desde,
  estado_publicacion = excluded.estado_publicacion,
  estado_comercial = excluded.estado_comercial,
  ciudad = excluded.ciudad,
  barrio = excluded.barrio,
  direccion = excluded.direccion,
  latitud = excluded.latitud,
  longitud = excluded.longitud,
  superficie_m2 = excluded.superficie_m2,
  tipo_propiedad = excluded.tipo_propiedad,
  dormitorios = excluded.dormitorios,
  banos = excluded.banos,
  cocheras = excluded.cocheras,
  ambientes = excluded.ambientes,
  apto_credito = excluded.apto_credito,
  fecha_entrega = excluded.fecha_entrega,
  financiamiento = excluded.financiamiento,
  services = excluded.services;

delete from public.listing_units where listing_id in ('t3', 'e1', 'e2', 'e3');
delete from public.listing_images where listing_id in ('p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 't1', 't2', 't3', 't4', 't5', 'e1', 'e2', 'e3');

insert into public.listing_units (id, listing_id, nombre, descripcion, superficie_m2, dormitorios, banos, cocheras, precio, moneda, estado_comercial, orden) values
('u-t3-1', 't3', 'Lote 01', null, 360, null, null, null, 35000, 'USD', 'DISPONIBLE', 1),
('u-t3-2', 't3', 'Lote 02', null, 420, null, null, null, 42000, 'USD', 'RESERVADO', 2),
('u-t3-3', 't3', 'Lote 03', null, 380, null, null, null, 37000, 'USD', 'DISPONIBLE', 3),
('u-t3-4', 't3', 'Lote 04', null, 460, null, null, null, 46000, 'USD', 'DISPONIBLE', 4),
('u-t3-5', 't3', 'Lote 05', null, 390, null, null, null, 39000, 'USD', 'VENDIDO', 5),
('u-e1-1', 'e1', '1 dormitorio', 'Unidad de 1 dormitorio con cocina integrada y balcón.', 48, 1, 1, null, 75000, 'USD', 'DISPONIBLE', 1),
('u-e1-2', 'e1', '1 dormitorio premium', 'Unidad de 1 dormitorio en piso superior con vista privilegiada.', 55, 1, 1, null, 88000, 'USD', 'DISPONIBLE', 2),
('u-e1-3', 'e1', '2 dormitorios', 'Unidad de 2 dormitorios con living-comedor amplio.', 68, 2, 1, null, 105000, 'USD', 'RESERVADO', 3),
('u-e1-4', 'e1', '2 dormitorios suite', 'Unidad de 2 dormitorios con suite y toilette.', 75, 2, 2, null, 118000, 'USD', 'DISPONIBLE', 4),
('u-e2-1', 'e2', '2 dormitorios', null, 68, 2, 1, null, 95000, 'USD', 'DISPONIBLE', 1),
('u-e2-2', 'e2', '2 dormitorios amplio', null, 82, 2, 2, null, 115000, 'USD', 'DISPONIBLE', 2),
('u-e2-3', 'e2', '3 dormitorios', null, 95, 3, 2, null, 138000, 'USD', 'DISPONIBLE', 3),
('u-e2-4', 'e2', '3 dormitorios suite', null, 110, 3, 3, 1, 162000, 'USD', 'RESERVADO', 4),
('u-e3-1', 'e3', '2 dormitorios', null, 72, 2, 1, null, 135000, 'USD', 'DISPONIBLE', 1),
('u-e3-2', 'e3', '3 dormitorios', null, 98, 3, 2, 1, 168000, 'USD', 'EN_NEGOCIACION', 2);

insert into public.listing_images (listing_id, external_url, alt_text, sort_order, is_cover) values
('p1', 'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2', 'Casa en Manantiales', 0, true),
('p1', 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3', 'Casa en Manantiales', 1, false),
('p1', 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6', 'Casa en Manantiales', 2, false),
('p2', 'https://images.unsplash.com/photo-1722421492323-eaf9c401befe', 'Departamento en Barrio Jardín', 0, true),
('p2', 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3', 'Departamento en Barrio Jardín', 1, false),
('p3', 'https://images.unsplash.com/photo-1698994705178-d244d73ea573', 'Casa en Jardines del Jockey', 0, true),
('p3', 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6', 'Casa en Jardines del Jockey', 1, false),
('p3', 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3', 'Casa en Jardines del Jockey', 2, false),
('p4', 'https://images.unsplash.com/photo-1748063578185-3d68121b11ff', 'PH en Camino San Carlos', 0, true),
('p5', 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33', 'Casa en Manantiales', 0, true),
('p5', 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3', 'Casa en Manantiales', 1, false),
('p6', 'https://images.unsplash.com/photo-1624204386084-dd8c05e32226', 'Departamento en Barrio Jardín', 0, true),
('p7', 'https://images.unsplash.com/photo-1706164971302-e30c0640cc3b', 'Casa en Jardines del Jockey', 0, true),
('p7', 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6', 'Casa en Jardines del Jockey', 1, false),
('p8', 'https://images.unsplash.com/photo-1722421492323-eaf9c401befe', 'Departamento en Camino San Carlos', 0, true),
('t1', 'https://images.unsplash.com/photo-1699375348655-c4564465969b', 'Lote en Manantiales', 0, true),
('t2', 'https://images.unsplash.com/photo-1637071985253-e5417fa2a47b', 'Lote en Barrio Jardín', 0, true),
('t3', 'https://images.unsplash.com/photo-1592113690727-36218027ff4f', 'Loteo Los Álamos', 0, true),
('t3', 'https://images.unsplash.com/photo-1699375348655-c4564465969b', 'Loteo Los Álamos', 1, false),
('t4', 'https://images.unsplash.com/photo-1637071985253-e5417fa2a47b', 'Terreno en Jardines del Jockey', 0, true),
('t5', 'https://images.unsplash.com/photo-1699375348655-c4564465969b', 'Terreno en Manantiales', 0, true),
('e1', 'https://images.unsplash.com/photo-1624204386084-dd8c05e32226', 'Origen Park', 0, true),
('e1', 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3', 'Origen Park', 1, false),
('e1', 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6', 'Origen Park', 2, false),
('e1', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'Origen Park', 3, false),
('e2', 'https://images.unsplash.com/photo-1515263487990-61b07816b324', 'Altos del Sur', 0, true),
('e2', 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6', 'Altos del Sur', 1, false),
('e2', 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3', 'Altos del Sur', 2, false),
('e3', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 'La Arboleda', 0, true),
('e3', 'https://images.unsplash.com/photo-1724582586529-62622e50c0b3', 'La Arboleda', 1, false),
('e3', 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6', 'La Arboleda', 2, false);

insert into public.site_settings (id, whatsapp_number, whatsapp_message_project, whatsapp_message_property, whatsapp_message_land, instagram_url)
values ('global', '5493515000000', 'Hola ORIGEN, quiero consultar por el emprendimiento {nombre}.', 'Hola ORIGEN, quiero consultar por la propiedad {nombre}.', 'Hola ORIGEN, quiero consultar por el terreno {nombre}.', 'https://instagram.com/origeninversiones')
on conflict (id) do update set
  whatsapp_number = excluded.whatsapp_number,
  whatsapp_message_project = excluded.whatsapp_message_project,
  whatsapp_message_property = excluded.whatsapp_message_property,
  whatsapp_message_land = excluded.whatsapp_message_land,
  instagram_url = excluded.instagram_url;

commit;
