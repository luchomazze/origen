begin;

-- Demo seed for the current Supabase schema.
-- IDs are deterministic so relations can be reseeded safely.

insert into public.listings (
  id, type, title, description, operation, address, neighborhood, city,
  latitude, longitude, price, currency, financing, delivery_date, services,
  publication_status, commercial_status, whatsapp_enabled
) values
('00000000-0000-4000-8000-000000000001', 'propiedad', 'Casa en Manantiales', 'Amplia casa en uno de los barrios más consolidados de Córdoba Sur. Planta baja y primer piso con jardín y cochera cubierta.', 'venta', null, 'Manantiales', 'Córdoba', -31.46, -64.22, 245000, 'USD', false, null, array['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000002', 'propiedad', 'Departamento en Barrio Jardín', 'Departamento luminoso con balcón orientado al norte. Edificio con amenities. Ideal para inversión o vivienda propia.', 'venta', null, 'Barrio Jardín', 'Córdoba', -31.40, -64.18, 118000, 'USD', false, null, array['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet', 'Fibra óptica'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000003', 'propiedad', 'Casa en Jardines del Jockey', 'Casa de categoría en barrio cerrado con acceso controlado. Amplio jardín, pileta y terminaciones de primera calidad.', 'venta', null, 'Jardines del Jockey', 'Córdoba', -31.44, -64.20, 380000, 'USD', false, null, array[]::text[], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000004', 'propiedad', 'PH en Camino San Carlos', 'PH en planta alta con terraza propia. Diseño moderno, cocina integrada y excelente iluminación natural.', 'venta', null, 'Camino San Carlos', 'Córdoba', -31.50, -64.25, 85000, 'USD', false, null, array[]::text[], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000005', 'propiedad', 'Casa en Manantiales', 'Residencia de categoría superior en Manantiales. Amplísimos espacios interiores y exteriores.', 'venta', null, 'Manantiales', 'Córdoba', -31.46, -64.23, 520000, 'USD', false, null, array[]::text[], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000006', 'propiedad', 'Departamento en Barrio Jardín', 'Departamento de 3 ambientes en edificio de categoría. Se encuentra reservado — consultá disponibilidad.', 'venta', null, 'Barrio Jardín', 'Córdoba', -31.41, -64.19, 175000, 'USD', false, null, array[]::text[], 'publicado', 'reservado', true),
('00000000-0000-4000-8000-000000000007', 'propiedad', 'Casa en Jardines del Jockey', 'Casa en uno de los barrios más buscados del sur de la ciudad. Buen estado de conservación.', 'venta', null, 'Jardines del Jockey', 'Córdoba', -31.45, -64.21, 295000, 'USD', false, null, array[]::text[], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000008', 'propiedad', 'Departamento en Camino San Carlos', 'Departamento de 2 dormitorios en un complejo tranquilo con amplios espacios verdes.', 'venta', null, 'Camino San Carlos', 'Córdoba', -31.51, -64.26, 138000, 'USD', false, null, array[]::text[], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000009', 'terreno', 'Lote en Manantiales', 'Lote en ubicación privilegiada dentro de Manantiales. Todos los servicios disponibles.', 'venta', null, 'Manantiales', 'Córdoba', -31.47, -64.22, 42000, 'USD', false, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000010', 'terreno', 'Lote en Barrio Jardín', 'Terreno en Barrio Jardín, zona consolidada y con fácil acceso.', 'venta', null, 'Barrio Jardín', 'Córdoba', -31.41, -64.18, 35000, 'USD', false, null, array['Agua corriente', 'Electricidad'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000011', 'terreno', 'Loteo Los Álamos', 'Loteo residencial en Docta, una de las zonas de mayor crecimiento de Córdoba Sur.', 'venta', null, 'Docta', 'Córdoba', -31.52, -64.28, 35000, 'USD', true, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural', 'Internet'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000012', 'terreno', 'Terreno en Jardines del Jockey', 'Terreno amplio en zona residencial consolidada.', 'venta', null, 'Jardines del Jockey', 'Córdoba', -31.44, -64.20, 55000, 'USD', false, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Seguridad'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000013', 'terreno', 'Terreno en Manantiales', 'Gran terreno en Manantiales con excelente ubicación y frente generoso.', 'venta', null, 'Manantiales', 'Córdoba', -31.48, -64.23, 72000, 'USD', false, null, array['Agua corriente', 'Electricidad', 'Cloacas', 'Gas natural', 'Internet', 'Fibra óptica'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000014', 'emprendimiento', 'Origen Park', 'Un nuevo concepto residencial en el corazón de Manantiales. Arquitectura contemporánea, calidad de vida y oportunidad de inversión.', 'venta', 'Manantiales, Córdoba Sur', 'Manantiales', 'Córdoba', -31.46, -64.22, 75000, 'USD', true, '2028-12-01', array['Gas natural', 'Agua corriente', 'Electricidad', 'Cloacas', 'Internet', 'Fibra óptica', 'Seguridad'], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000015', 'emprendimiento', 'Altos del Sur', 'Proyecto de gran escala con vistas panorámicas y unidades amplias en la zona sur de Córdoba.', 'venta', 'Zona Sur, Córdoba', 'Córdoba Sur', 'Córdoba', -31.49, -64.25, 95000, 'USD', true, '2027-06-01', array[]::text[], 'publicado', 'disponible', true),
('00000000-0000-4000-8000-000000000016', 'emprendimiento', 'La Arboleda', 'Proyecto finalizado y entregado, con unidades disponibles para entrega inmediata.', 'venta', 'Camino San Carlos, Córdoba Sur', 'Camino San Carlos', 'Córdoba', -31.51, -64.27, 135000, 'USD', true, null, array[]::text[], 'publicado', 'disponible', true)
on conflict (id) do update set
  type = excluded.type,
  title = excluded.title,
  description = excluded.description,
  operation = excluded.operation,
  address = excluded.address,
  neighborhood = excluded.neighborhood,
  city = excluded.city,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  price = excluded.price,
  price_from = excluded.price_from,
  currency = excluded.currency,
  financing = excluded.financing,
  delivery_date = excluded.delivery_date,
  services = excluded.services,
  publication_status = excluded.publication_status,
  commercial_status = excluded.commercial_status,
  whatsapp_enabled = excluded.whatsapp_enabled;

update public.listings
set price_from = id in (
  '00000000-0000-4000-8000-000000000014',
  '00000000-0000-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000016'
)
where id between '00000000-0000-4000-8000-000000000001' and '00000000-0000-4000-8000-000000000016';

delete from public.listing_typologies where listing_id in (
  '00000000-0000-4000-8000-000000000011',
  '00000000-0000-4000-8000-000000000014',
  '00000000-0000-4000-8000-000000000015',
  '00000000-0000-4000-8000-000000000016'
);

insert into public.listing_typologies (id, listing_id, name, description, surface_m2, price, currency, bedrooms, bathrooms) values
('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000011', 'Lote 01', null, 360, 35000, 'USD', null, null),
('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000011', 'Lote 02', null, 420, 42000, 'USD', null, null),
('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000011', 'Lote 03', null, 380, 37000, 'USD', null, null),
('10000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000011', 'Lote 04', null, 460, 46000, 'USD', null, null),
('10000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000011', 'Lote 05', null, 390, 39000, 'USD', null, null),
('10000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000014', '1 dormitorio', 'Unidad con cocina integrada y balcón.', 48, 75000, 'USD', 1, 1),
('10000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000014', '1 dormitorio premium', 'Unidad en piso superior con vista privilegiada.', 55, 88000, 'USD', 1, 1),
('10000000-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000014', '2 dormitorios', 'Unidad con living-comedor amplio.', 68, 105000, 'USD', 2, 1),
('10000000-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000014', '2 dormitorios suite', 'Unidad con suite y toilette.', 75, 118000, 'USD', 2, 2),
('10000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000015', '2 dormitorios', null, 68, 95000, 'USD', 2, 1),
('10000000-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000015', '2 dormitorios amplio', null, 82, 115000, 'USD', 2, 2),
('10000000-0000-4000-8000-000000000012', '00000000-0000-4000-8000-000000000015', '3 dormitorios', null, 95, 138000, 'USD', 3, 2),
('10000000-0000-4000-8000-000000000013', '00000000-0000-4000-8000-000000000015', '3 dormitorios suite', null, 110, 162000, 'USD', 3, 3),
('10000000-0000-4000-8000-000000000014', '00000000-0000-4000-8000-000000000016', '2 dormitorios', null, 72, 135000, 'USD', 2, 1),
('10000000-0000-4000-8000-000000000015', '00000000-0000-4000-8000-000000000016', '3 dormitorios', null, 98, 168000, 'USD', 3, 2)
on conflict (id) do update set
  listing_id = excluded.listing_id,
  name = excluded.name,
  description = excluded.description,
  surface_m2 = excluded.surface_m2,
  price = excluded.price,
  currency = excluded.currency,
  bedrooms = excluded.bedrooms,
  bathrooms = excluded.bathrooms;

delete from public.listing_images where listing_id in (
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000006',
  '00000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000008',
  '00000000-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000010',
  '00000000-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000012',
  '00000000-0000-4000-8000-000000000013', '00000000-0000-4000-8000-000000000014',
  '00000000-0000-4000-8000-000000000015', '00000000-0000-4000-8000-000000000016'
);

insert into public.listing_images (listing_id, image_url, display_order) values
('00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2', 0),
('00000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1722421492323-eaf9c401befe', 0),
('00000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1698994705178-d244d73ea573', 0),
('00000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1748063578185-3d68121b11ff', 0),
('00000000-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33', 0),
('00000000-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1624204386084-dd8c05e32226', 0),
('00000000-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1706164971302-e30c0640cc3b', 0),
('00000000-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1722421492323-eaf9c401befe', 0),
('00000000-0000-4000-8000-000000000009', 'https://images.unsplash.com/photo-1699375348655-c4564465969b', 0),
('00000000-0000-4000-8000-000000000010', 'https://images.unsplash.com/photo-1637071985253-e5417fa2a47b', 0),
('00000000-0000-4000-8000-000000000011', 'https://images.unsplash.com/photo-1592113690727-36218027ff4f', 0),
('00000000-0000-4000-8000-000000000012', 'https://images.unsplash.com/photo-1637071985253-e5417fa2a47b', 0),
('00000000-0000-4000-8000-000000000013', 'https://images.unsplash.com/photo-1699375348655-c4564465969b', 0),
('00000000-0000-4000-8000-000000000014', 'https://images.unsplash.com/photo-1624204386084-dd8c05e32226', 0),
('00000000-0000-4000-8000-000000000015', 'https://images.unsplash.com/photo-1515263487990-61b07816b324', 0),
('00000000-0000-4000-8000-000000000016', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00', 0);

insert into public.site_settings (
  site_name, whatsapp_number, instagram_url, whatsapp_enabled,
  whatsapp_template_emprendimiento, whatsapp_template_propiedad, whatsapp_template_terreno,
  site_description
)
select
  'ORIGEN', '5493515000000', 'https://instagram.com/origeninversiones', true,
  'Hola ORIGEN, quiero consultar por el emprendimiento {nombre}.',
  'Hola ORIGEN, quiero consultar por la propiedad {nombre}.',
  'Hola ORIGEN, quiero consultar por el terreno {nombre}.',
  'Inversiones inmobiliarias en Córdoba Sur.'
where not exists (select 1 from public.site_settings);

commit;
