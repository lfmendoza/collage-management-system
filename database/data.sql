-- ====================================
-- DATOS DE PRUEBA - SISTEMA UNIVERSITARIO
-- Más de 1000 registros distribuidos
-- ====================================

-- Conectar a la base de datos

-- ====================================
-- DATOS GEOGRÁFICOS
-- ====================================

-- Países
INSERT INTO paises (nombre, codigo_iso, codigo_telefono) VALUES
('Guatemala', 'GT', '+502'),
('México', 'MX', '+52'),
('Estados Unidos', 'US', '+1'),
('El Salvador', 'SV', '+503'),
('Honduras', 'HN', '+504'),
('Costa Rica', 'CR', '+506'),
('Panamá', 'PA', '+507'),
('Colombia', 'CO', '+57'),
('España', 'ES', '+34'),
('Argentina', 'AR', '+54');

-- Departamentos de Guatemala
INSERT INTO departamentos (nombre, pais_id) VALUES
('Guatemala', 1),
('Sacatepéquez', 1),
('Chimaltenango', 1),
('Escuintla', 1),
('Santa Rosa', 1),
('Sololá', 1),
('Totonicapán', 1),
('Quetzaltenango', 1),
('Suchitepéquez', 1),
('Retalhuleu', 1),
('San Marcos', 1),
('Huehuetenango', 1),
('Quiché', 1),
('Baja Verapaz', 1),
('Alta Verapaz', 1),
('Petén', 1),
('Izabal', 1),
('Zacapa', 1),
('Chiquimula', 1),
('Jalapa', 1),
('Jutiapa', 1),
('Progreso', 1);

-- Municipios principales
INSERT INTO municipios (nombre, departamento_id) VALUES
('Ciudad de Guatemala', 1),
('Mixco', 1),
('Villa Nueva', 1),
('Petapa', 1),
('San José Pinula', 1),
('Antigua Guatemala', 2),
('Ciudad Vieja', 2),
('Jocotenango', 2),
('Chimaltenango', 3),
('San Martín Jilotepeque', 3),
('Escuintla', 4),
('Santa Lucía Cotzumalguapa', 4),
('Cuilapa', 5),
('Barberena', 5),
('Sololá', 6),
('Panajachel', 6),
('Totonicapán', 7),
('San Cristóbal Totonicapán', 7),
('Quetzaltenango', 8),
('Salcajá', 8),
('Mazatenango', 9),
('Chicacao', 9),
('Retalhuleu', 10),
('San Sebastián', 10),
('San Marcos', 11),
('Malacatán', 11),
('Huehuetenango', 12),
('Chiantla', 12),
('Santa Cruz del Quiché', 13),
('Chichicastenango', 13),
('Salamá', 14),
('Rabinal', 14),
('Cobán', 15),
('San Pedro Carchá', 15),
('Flores', 16),
('San Benito', 16),
('Puerto Barrios', 17),
('Livingston', 17),
('Zacapa', 18),
('Estanzuela', 18),
('Chiquimula', 19),
('Jocotán', 19),
('Jalapa', 20),
('San Pedro Pinula', 20),
('Jutiapa', 21),
('Asunción Mita', 21),
('Guastatoja', 22),
('San Agustín Acasaguastlán', 22);

-- ====================================
-- ESTRUCTURA ACADÉMICA
-- ====================================

-- Facultades
INSERT INTO facultades (nombre, codigo, descripcion, fecha_fundacion) VALUES
('Facultad de Ingeniería', 'FING', 'Facultad dedicada a la formación de ingenieros en diversas especialidades', '1968-03-15'),
('Facultad de Ciencias Económicas', 'FECO', 'Formación en administración, economía y contaduría', '1970-01-20'),
('Facultad de Medicina', 'FMED', 'Formación médica y ciencias de la salud', '1965-08-10'),
('Facultad de Derecho', 'FDER', 'Ciencias jurídicas y sociales', '1962-05-30'),
('Facultad de Arquitectura', 'FARQ', 'Diseño arquitectónico y urbanismo', '1975-09-12'),
('Facultad de Ciencias y Humanidades', 'FCH', 'Educación, psicología, filosofía y letras', '1960-02-28'),
('Facultad de Ciencias Químicas y Farmacia', 'FCQF', 'Química, farmacia y biología', '1972-11-05'),
('Facultad de Odontología', 'FODO', 'Ciencias odontológicas', '1974-04-18'),
('Facultad de Veterinaria y Zootecnia', 'FVET', 'Medicina veterinaria y zootecnia', '1976-07-22'),
('Facultad de Agronomía', 'FAGRO', 'Ciencias agrícolas y forestales', '1971-10-15');

-- Carreras
INSERT INTO carreras (nombre, codigo, facultad_id, duracion_semestres, creditos_totales) VALUES
-- Ingeniería
('Ingeniería en Ciencias de la Computación', 'ING-CC', 1, 10, 280),
('Ingeniería Industrial', 'ING-IND', 1, 10, 275),
('Ingeniería Civil', 'ING-CIV', 1, 10, 285),
('Ingeniería Electrónica', 'ING-ELE', 1, 10, 280),
('Ingeniería Mecánica', 'ING-MEC', 1, 10, 275),
('Ingeniería Química', 'ING-QUI', 1, 10, 280),
-- Económicas
('Administración de Empresas', 'ADM-EMP', 2, 8, 220),
('Contaduría Pública y Auditoría', 'CPA', 2, 8, 215),
('Economía', 'ECO', 2, 8, 210),
('Mercadotecnia', 'MKT', 2, 8, 215),
-- Medicina
('Medicina y Cirugía', 'MED-CIR', 3, 12, 350),
('Enfermería', 'ENF', 3, 8, 240),
('Nutrición', 'NUT', 3, 8, 235),
('Fisioterapia', 'FISIO', 3, 8, 230),
-- Derecho
('Ciencias Jurídicas y Sociales', 'DER', 4, 10, 260),
('Ciencias Políticas', 'POL', 4, 8, 220),
-- Arquitectura
('Arquitectura', 'ARQ', 5, 10, 270),
('Diseño Gráfico', 'DG', 5, 8, 210),
-- Humanidades
('Psicología', 'PSI', 6, 10, 250),
('Pedagogía', 'PED', 6, 8, 200),
('Historia', 'HIST', 6, 8, 195),
('Filosofía', 'FIL', 6, 8, 190),
-- Químicas y Farmacia
('Química Farmacéutica', 'QF', 7, 10, 265),
('Biología', 'BIO', 7, 8, 225),
('Química', 'QUI', 7, 8, 220),
-- Odontología
('Cirujano Dentista', 'ODO', 8, 10, 280),
-- Veterinaria
('Medicina Veterinaria', 'VET', 9, 10, 275),
('Zootecnia', 'ZOO', 9, 8, 230),
-- Agronomía
('Ingeniería Agronómica', 'AGR', 10, 10, 270),
('Ingeniería Forestal', 'FOR', 10, 10, 265);

-- Materias (selección representativa)
INSERT INTO materias (nombre, codigo, creditos, horas_teoricas, horas_practicas, descripcion) VALUES
-- Materias básicas
('Matemática I', 'MAT101', 5, 4, 2, 'Álgebra y trigonometría básica'),
('Matemática II', 'MAT102', 5, 4, 2, 'Cálculo diferencial'),
('Matemática III', 'MAT103', 5, 4, 2, 'Cálculo integral'),
('Física I', 'FIS101', 4, 3, 2, 'Mecánica clásica'),
('Física II', 'FIS102', 4, 3, 2, 'Electricidad y magnetismo'),
('Química General', 'QUI101', 4, 3, 2, 'Principios básicos de química'),
('Idioma Técnico I', 'IDT101', 3, 3, 0, 'Inglés técnico nivel básico'),
('Idioma Técnico II', 'IDT102', 3, 3, 0, 'Inglés técnico nivel intermedio'),
('Estadística I', 'EST101', 4, 3, 2, 'Estadística descriptiva'),
('Estadística II', 'EST102', 4, 3, 2, 'Estadística inferencial'),

-- Computación
('Introducción a la Programación', 'CC101', 5, 3, 4, 'Fundamentos de programación'),
('Programación Orientada a Objetos', 'CC102', 5, 3, 4, 'POO con Java'),
('Estructura de Datos', 'CC201', 5, 3, 4, 'Algoritmos y estructuras de datos'),
('Base de Datos I', 'CC301', 4, 3, 2, 'Diseño de bases de datos relacionales'),
('Base de Datos II', 'CC302', 4, 3, 2, 'Administración avanzada de BD'),
('Sistemas Operativos', 'CC401', 4, 3, 2, 'Fundamentos de SO'),
('Redes de Computadoras', 'CC501', 4, 3, 2, 'Protocolos y arquitecturas de red'),
('Ingeniería de Software', 'CC601', 5, 4, 2, 'Metodologías de desarrollo'),
('Inteligencia Artificial', 'CC701', 4, 3, 2, 'Fundamentos de IA'),
('Compiladores', 'CC801', 5, 4, 2, 'Diseño de compiladores'),

-- Industrial
('Investigación de Operaciones I', 'IND301', 4, 3, 2, 'Programación lineal'),
('Investigación de Operaciones II', 'IND302', 4, 3, 2, 'Modelos de optimización'),
('Control de Calidad', 'IND401', 4, 3, 2, 'Sistemas de calidad'),
('Seguridad Industrial', 'IND501', 3, 3, 1, 'Prevención de riesgos laborales'),
('Ergonomía', 'IND601', 3, 2, 2, 'Diseño ergonómico'),

-- Civil
('Topografía', 'CIV201', 4, 2, 4, 'Levantamientos topográficos'),
('Mecánica de Suelos', 'CIV301', 4, 3, 2, 'Propiedades geotécnicas'),
('Resistencia de Materiales', 'CIV401', 5, 4, 2, 'Análisis estructural'),
('Hidráulica', 'CIV501', 4, 3, 2, 'Mecánica de fluidos aplicada'),
('Concreto Armado', 'CIV601', 5, 4, 2, 'Diseño de estructuras de concreto'),

-- Administración
('Contabilidad I', 'ADM101', 4, 3, 2, 'Principios contables básicos'),
('Contabilidad II', 'ADM102', 4, 3, 2, 'Contabilidad intermedia'),
('Administración I', 'ADM201', 4, 4, 0, 'Fundamentos administrativos'),
('Administración II', 'ADM202', 4, 4, 0, 'Teorías administrativas'),
('Mercadotecnia I', 'ADM301', 4, 3, 1, 'Fundamentos de marketing'),
('Finanzas I', 'ADM401', 4, 3, 1, 'Administración financiera'),
('Recursos Humanos', 'ADM501', 4, 3, 1, 'Gestión del talento humano'),

-- Medicina
('Anatomía Humana I', 'MED101', 6, 4, 4, 'Anatomía del sistema locomotor'),
('Anatomía Humana II', 'MED102', 6, 4, 4, 'Anatomía de sistemas orgánicos'),
('Fisiología Humana I', 'MED201', 5, 4, 2, 'Fisiología básica'),
('Fisiología Humana II', 'MED202', 5, 4, 2, 'Fisiología de sistemas'),
('Patología General', 'MED301', 5, 4, 2, 'Fundamentos patológicos'),
('Microbiología', 'MED401', 4, 3, 2, 'Microorganismos patógenos'),
('Farmacología', 'MED501', 5, 4, 2, 'Acción de fármacos'),

-- Materias de servicio y electivas
('Técnicas de Estudio', 'GEN101', 2, 2, 0, 'Metodología de estudio'),
('Deportes I', 'DEP101', 1, 0, 2, 'Actividad física'),
('Deportes II', 'DEP102', 1, 0, 2, 'Actividad física intermedia'),
('Ética Profesional', 'ETI101', 3, 3, 0, 'Principios éticos profesionales'),
('Medio Ambiente', 'AMB101', 3, 3, 0, 'Conciencia ambiental'),
('Emprendimiento', 'EMP101', 3, 2, 1, 'Desarrollo empresarial'),
('Liderazgo', 'LID101', 3, 3, 0, 'Desarrollo de liderazgo'),
('Comunicación Oral y Escrita', 'COM101', 3, 3, 0, 'Técnicas de comunicación');

-- Pensum (relación carrera-materia-semestre) - muestra para algunas carreras
INSERT INTO pensum (carrera_id, materia_id, semestre, obligatoria) VALUES
-- Ingeniería en Ciencias de la Computación (carrera_id = 1)
(1, 1, 1, true),   -- Matemática I
(1, 4, 1, true),   -- Física I
(1, 11, 1, true),  -- Introducción a la Programación
(1, 46, 1, true),  -- Técnicas de Estudio
(1, 49, 1, true),  -- Ética Profesional
(1, 2, 2, true),   -- Matemática II
(1, 5, 2, true),   -- Física II
(1, 12, 2, true),  -- POO
(1, 7, 2, true),   -- Idioma Técnico I
(1, 47, 2, false), -- Deportes I
(1, 3, 3, true),   -- Matemática III
(1, 6, 3, true),   -- Química General
(1, 13, 3, true),  -- Estructura de Datos
(1, 9, 3, true),   -- Estadística I
(1, 8, 3, true),   -- Idioma Técnico II
(1, 48, 4, false), -- Deportes II
(1, 10, 4, true),  -- Estadística II
(1, 14, 4, true),  -- Base de Datos I
(1, 16, 4, true),  -- Sistemas Operativos
(1, 52, 4, true),  -- Comunicación Oral y Escrita
(1, 15, 5, true),  -- Base de Datos II
(1, 17, 5, true),  -- Redes de Computadoras
(1, 18, 6, true),  -- Ingeniería de Software
(1, 19, 7, true),  -- Inteligencia Artificial
(1, 20, 8, true),  -- Compiladores
(1, 50, 9, true),  -- Medio Ambiente
(1, 51, 10, true), -- Emprendimiento

-- Ingeniería Industrial (carrera_id = 2)
(2, 1, 1, true),   -- Matemática I
(2, 4, 1, true),   -- Física I
(2, 6, 1, true),   -- Química General
(2, 46, 1, true),  -- Técnicas de Estudio
(2, 2, 2, true),   -- Matemática II
(2, 5, 2, true),   -- Física II
(2, 7, 2, true),   -- Idioma Técnico I
(2, 31, 2, true),  -- Contabilidad I
(2, 3, 3, true),   -- Matemática III
(2, 9, 3, true),   -- Estadística I
(2, 8, 3, true),   -- Idioma Técnico II
(2, 32, 3, true),  -- Contabilidad II
(2, 10, 4, true),  -- Estadística II
(2, 21, 4, true),  -- Investigación de Operaciones I
(2, 33, 4, true),  -- Administración I
(2, 22, 5, true),  -- Investigación de Operaciones II
(2, 34, 5, true),  -- Administración II
(2, 23, 6, true),  -- Control de Calidad
(2, 24, 7, true),  -- Seguridad Industrial
(2, 25, 8, true),  -- Ergonomía
(2, 49, 9, true),  -- Ética Profesional
(2, 51, 10, true); -- Emprendimiento

-- ====================================
-- EDIFICIOS Y AULAS
-- ====================================

INSERT INTO edificios (nombre, codigo, direccion, niveles) VALUES
('Edificio T-1', 'T1', 'Campus Central, Zona 12', 4),
('Edificio T-3', 'T3', 'Campus Central, Zona 12', 5),
('Edificio S-11', 'S11', 'Campus Central, Zona 12', 3),
('Edificio S-12', 'S12', 'Campus Central, Zona 12', 3),
('Edificio M-1', 'M1', 'Campus Central, Zona 12', 4),
('Edificio M-2', 'M2', 'Campus Central, Zona 12', 4),
('Edificio M-6', 'M6', 'Campus Central, Zona 12', 2),
('Centro de Cálculo', 'CC', 'Campus Central, Zona 12', 2),
('Biblioteca Central', 'BC', 'Campus Central, Zona 12', 5),
('Edificio de Bienestar Estudiantil', 'BE', 'Campus Central, Zona 12', 3);

INSERT INTO aulas (codigo, edificio_id, capacidad, tipo, equipamiento) VALUES
-- Edificio T-1
('T1-101', 1, 40, 'aula_normal', 'Pizarra, proyector, aire acondicionado'),
('T1-102', 1, 35, 'aula_normal', 'Pizarra, proyector'),
('T1-103', 1, 45, 'aula_normal', 'Pizarra, proyector, aire acondicionado'),
('T1-201', 1, 40, 'aula_normal', 'Pizarra, proyector'),
('T1-202', 1, 38, 'aula_normal', 'Pizarra, proyector, aire acondicionado'),
('T1-301', 1, 42, 'aula_normal', 'Pizarra, proyector'),
('T1-401', 1, 30, 'laboratorio', 'Computadoras, proyector, aire acondicionado'),

-- Edificio T-3
('T3-101', 2, 50, 'aula_magna', 'Pizarra, proyector, sonido, aire acondicionado'),
('T3-102', 2, 45, 'aula_normal', 'Pizarra, proyector'),
('T3-201', 2, 40, 'aula_normal', 'Pizarra, proyector, aire acondicionado'),
('T3-301', 2, 35, 'laboratorio', 'Computadoras, proyector'),
('T3-401', 2, 25, 'laboratorio', 'Computadoras, proyector, aire acondicionado'),

-- Centro de Cálculo
('CC-01', 8, 30, 'laboratorio_computo', '30 computadoras, proyector, aire acondicionado'),
('CC-02', 8, 25, 'laboratorio_computo', '25 computadoras, proyector, aire acondicionado'),
('CC-03', 8, 35, 'laboratorio_computo', '35 computadoras, proyector'),
('CC-04', 8, 20, 'laboratorio_especializado', 'Servidores, equipos de red');

-- ====================================
-- DEPARTAMENTOS ACADÉMICOS
-- ====================================

INSERT INTO departamentos_academicos (nombre, facultad_id, presupuesto) VALUES
('Departamento de Ciencias de la Computación', 1, 500000.00),
('Departamento de Ingeniería Industrial', 1, 450000.00),
('Departamento de Ingeniería Civil', 1, 600000.00),
('Departamento de Matemática y Física', 1, 300000.00),
('Departamento de Administración', 2, 350000.00),
('Departamento de Contaduría', 2, 300000.00),
('Departamento de Economía', 2, 280000.00),
('Departamento de Ciencias Básicas', 3, 400000.00),
('Departamento de Ciencias Clínicas', 3, 800000.00),
('Departamento de Ciencias Jurídicas', 4, 250000.00);

-- ====================================
-- PROFESORES
-- ====================================

INSERT INTO profesores (codigo_empleado, nombres, apellidos, email, telefono, fecha_nacimiento, dpi, direccion, municipio_id, especialidad, grado_academico, salario) VALUES
('P001', 'Carlos Eduardo', 'García López', 'cgarcia@universidad.edu.gt', '2234-5678', '1975-03-15', '1598753542301', 'Zona 14, Ciudad de Guatemala', 1, 'Ciencias de la Computación', 'Doctor en Ciencias de la Computación', 15000.00),
('P002', 'María José', 'Rodríguez Pérez', 'mrodriguez@universidad.edu.gt', '2345-6789', '1980-07-22', '2698741532402', 'Zona 15, Ciudad de Guatemala', 1, 'Base de Datos', 'Maestría en Ciencias de la Computación', 12000.00),
('P003', 'Luis Fernando', 'Morales Castro', 'lmorales@universidad.edu.gt', '2456-7890', '1972-11-08', '1887654321503', 'Mixco', 2, 'Inteligencia Artificial', 'Doctor en Inteligencia Artificial', 16000.00),
('P004', 'Ana Lucía', 'Hernández Mejía', 'ahernandez@universidad.edu.gt', '2567-8901', '1978-05-30', '2776543219604', 'Villa Nueva', 3, 'Ingeniería de Software', 'Maestría en Ingeniería de Software', 11500.00),
('P005', 'Roberto Carlos', 'Jiménez Solís', 'rjimenez@universidad.edu.gt', '2678-9012', '1969-09-12', '1665432108705', 'Zona 10, Ciudad de Guatemala', 1, 'Algoritmos', 'Doctor en Matemáticas', 14500.00),
('P006', 'Sandra Patricia', 'Vásquez Luna', 'svasquez@universidad.edu.gt', '2789-0123', '1982-01-25', '2554321098806', 'Antigua Guatemala', 6, 'Redes de Computadoras', 'Maestría en Telecomunicaciones', 10800.00),
('P007', 'Miguel Ángel', 'Sánchez Ruiz', 'msanchez@universidad.edu.gt', '2890-1234', '1976-12-03', '1443210987907', 'Zona 12, Ciudad de Guatemala', 1, 'Sistemas Operativos', 'Maestría en Ciencias de la Computación', 11200.00),
('P008', 'Claudia Esperanza', 'Torres Méndez', 'ctorres@universidad.edu.gt', '2901-2345', '1984-08-18', '2332109876008', 'Mixco', 2, 'Programación', 'Licenciatura en Ciencias de la Computación', 9500.00),
('P009', 'Álvaro José', 'Ramírez Flores', 'aramirez@universidad.edu.gt', '3012-3456', '1971-04-07', '1221098765109', 'Petapa', 4, 'Matemáticas', 'Doctor en Matemáticas', 13000.00),
('P010', 'Gloria Esperanza', 'Mendoza Castillo', 'gmendoza@universidad.edu.gt', '3123-4567', '1979-10-14', '2110987654210', 'San José Pinula', 5, 'Física', 'Maestría en Física', 10500.00),
('P011', 'Fernando Antonio', 'López Díaz', 'flopez@universidad.edu.gt', '3234-5678', '1983-06-28', '2009876543311', 'Zona 7, Ciudad de Guatemala', 1, 'Investigación de Operaciones', 'Maestría en Ingeniería Industrial', 11800.00),
('P012', 'Miriam Elizabeth', 'Gómez Herrera', 'mgomez@universidad.edu.gt', '3345-6789', '1977-02-11', '1998765432412', 'Chimaltenango', 9, 'Control de Calidad', 'Maestría en Ingeniería Industrial', 10200.00),
('P013', 'Jorge Alberto', 'Cruz Morales', 'jcruz@universidad.edu.gt', '3456-7890', '1985-09-05', '1887654321513', 'Escuintla', 11, 'Seguridad Industrial', 'Especialización en Seguridad Industrial', 9800.00),
('P014', 'Karla Sofía', 'Aguilar Reyes', 'kaguilar@universidad.edu.gt', '3567-8901', '1981-12-20', '1776543210614', 'Quetzaltenango', 19, 'Ergonomía', 'Maestría en Ergonomía', 10000.00),
('P015', 'Emilio Rodrigo', 'Vargas Espinoza', 'evargas@universidad.edu.gt', '3678-9012', '1974-03-17', '1665432109715', 'Sololá', 15, 'Resistencia de Materiales', 'Maestría en Ingeniería Civil', 11500.00),
('P016', 'Wendy Marisol', 'Chávez Ordóñez', 'wchavez@universidad.edu.gt', '3789-0123', '1986-07-09', '1554321098816', 'Cobán', 33, 'Topografía', 'Licenciatura en Ingeniería Civil', 9200.00),
('P017', 'Óscar Danilo', 'Pineda Guzmán', 'opineda@universidad.edu.gt', '3890-1234', '1970-11-23', '1443210987917', 'Zona 11, Ciudad de Guatemala', 1, 'Mecánica de Suelos', 'Doctor en Ingeniería Civil', 15500.00),
('P018', 'Silvia Judith', 'Monzón Barrios', 'smonzon@universidad.edu.gt', '3901-2345', '1988-05-16', '1332109876018', 'Huehuetenango', 27, 'Hidráulica', 'Maestría en Recursos Hídricos', 10800.00),
('P019', 'Raúl Enrique', 'Padilla Coronado', 'rpadilla@universidad.edu.gt', '4012-3456', '1973-08-31', '1221098765119', 'San Marcos', 25, 'Concreto Armado', 'Maestría en Estructuras', 12200.00),
('P020', 'Patricia Elena', 'Arriola Figueroa', 'parriola@universidad.edu.gt', '4123-4567', '1987-01-04', '1110987654220', 'Retalhuleu', 23, 'Administración', 'Maestría en Administración', 10500.00),
('P021', 'Héctor Manuel', 'Castañeda Ruano', 'hcastaneda@universidad.edu.gt', '4234-5678', '1975-10-27', '2009876543221', 'Jalapa', 41, 'Contabilidad', 'CPA, Maestría en Finanzas', 11000.00),
('P022', 'Sonia Beatriz', 'Galindo Portillo', 'sgalindo@universidad.edu.gt', '4345-6789', '1982-04-13', '1998765432322', 'Jutiapa', 43, 'Mercadotecnia', 'Maestría en Mercadotecnia', 9800.00),
('P023', 'Alejandro David', 'Maldonado Rivas', 'amaldonado@universidad.edu.gt', '4456-7890', '1979-12-08', '1887654321423', 'Zacapa', 39, 'Finanzas', 'Maestría en Finanzas Corporativas', 12500.00),
('P024', 'Carmen Leticia', 'Estrada Morán', 'cestrada@universidad.edu.gt', '4567-8901', '1984-06-21', '1776543210524', 'Chiquimula', 41, 'Recursos Humanos', 'Maestría en Gestión del Talento', 10200.00),
('P025', 'Gustavo Adolfo', 'Cabrera Sandoval', 'gcabrera@universidad.edu.gt', '4678-9012', '1976-09-15', '1665432109625', 'Puerto Barrios', 37, 'Anatomía', 'Doctor en Medicina', 18000.00),
('P026', 'Roxana Isabel', 'Montenegro Guerra', 'rmontenegro@universidad.edu.gt', '4789-0123', '1983-02-28', '1554321098726', 'Livingston', 38, 'Fisiología', 'Doctor en Fisiología', 17500.00),
('P027', 'Eduardo Sebastián', 'Archila Contreras', 'earchila@universidad.edu.gt', '4890-1234', '1981-11-11', '1443210987827', 'Flores', 35, 'Patología', 'Doctor en Patología', 16800.00),
('P028', 'Ingrid Alejandra', 'Muñoz Velásquez', 'imunoz@universidad.edu.gt', '4901-2345', '1978-07-24', '1332109876928', 'San Benito', 36, 'Microbiología', 'Doctor en Microbiología', 16200.00),
('P029', 'Rolando Estuardo', 'Sagastume Alvarado', 'rsagastume@universidad.edu.gt', '5012-3456', '1985-12-19', '1221098765029', 'Salamá', 31, 'Farmacología', 'Doctor en Farmacología', 17000.00),
('P030', 'Evelyn Maribel', 'Coronado Paz', 'ecoronado@universidad.edu.gt', '5123-4567', '1977-05-06', '1110987654130', 'Rabinal', 32, 'Inglés Técnico', 'Maestría en Lingüística Aplicada', 8500.00);

-- ====================================
-- ASIGNACIONES PROFESOR-DEPARTAMENTO
-- ====================================

INSERT INTO profesor_departamento (profesor_id, departamento_id, porcentaje_tiempo) VALUES
(1, 1, 100.00),   -- Carlos García - CC
(2, 1, 100.00),   -- María Rodríguez - CC  
(3, 1, 100.00),   -- Luis Morales - CC
(4, 1, 100.00),   -- Ana Hernández - CC
(5, 4, 100.00),   -- Roberto Jiménez - Mat y Fís
(6, 1, 100.00),   -- Sandra Vásquez - CC
(7, 1, 100.00),   -- Miguel Sánchez - CC
(8, 1, 100.00),   -- Claudia Torres - CC
(9, 4, 100.00),   -- Álvaro Ramírez - Mat y Fís
(10, 4, 100.00),  -- Gloria Mendoza - Mat y Fís
(11, 2, 100.00),  -- Fernando López - Ing. Industrial
(12, 2, 100.00),  -- Miriam Gómez - Ing. Industrial
(13, 2, 100.00),  -- Jorge Cruz - Ing. Industrial
(14, 2, 100.00),  -- Karla Aguilar - Ing. Industrial
(15, 3, 100.00),  -- Emilio Vargas - Ing. Civil
(16, 3, 100.00),  -- Wendy Chávez - Ing. Civil
(17, 3, 100.00),  -- Óscar Pineda - Ing. Civil
(18, 3, 100.00),  -- Silvia Monzón - Ing. Civil
(19, 3, 100.00),  -- Raúl Padilla - Ing. Civil
(20, 5, 100.00),  -- Patricia Arriola - Administración
(21, 6, 100.00),  -- Héctor Castañeda - Contaduría
(22, 5, 100.00),  -- Sonia Galindo - Administración
(23, 5, 100.00),  -- Alejandro Maldonado - Administración
(24, 5, 100.00),  -- Carmen Estrada - Administración
(25, 8, 100.00),  -- Gustavo Cabrera - Ciencias Básicas Med
(26, 8, 100.00),  -- Roxana Montenegro - Ciencias Básicas Med
(27, 9, 100.00),  -- Eduardo Archila - Ciencias Clínicas
(28, 8, 100.00),  -- Ingrid Muñoz - Ciencias Básicas Med
(29, 9, 100.00),  -- Rolando Sagastume - Ciencias Clínicas
(30, 4, 50.00);   -- Evelyn Coronado - Mat y Fís (medio tiempo)

-- ====================================
-- ESTUDIANTES (200 estudiantes diversos)
-- ====================================

INSERT INTO estudiantes (carnet, nombres, apellidos, email, telefono, fecha_nacimiento, dpi, direccion, municipio_id, fecha_ingreso) VALUES
('2020001', 'José María', 'González Pérez', 'jgonzalez2020001@universidad.edu.gt', '5555-1001', '2002-03-15', '3001234567801', 'Zona 1, Ciudad de Guatemala', 1, '2020-01-15'),
('2020002', 'Ana Sofía', 'Martínez López', 'amartinez2020002@universidad.edu.gt', '5555-1002', '2001-07-22', '3012345678902', 'Mixco', 2, '2020-01-15'),
('2020003', 'Carlos Eduardo', 'Hernández García', 'chernandez2020003@universidad.edu.gt', '5555-1003', '2002-11-08', '3023456789003', 'Villa Nueva', 3, '2020-01-15'),
('2020004', 'María José', 'Rodríguez Morales', 'mrodriguez2020004@universidad.edu.gt', '5555-1004', '2001-05-30', '3034567890104', 'Petapa', 4, '2020-01-15'),
('2020005', 'Luis Fernando', 'Castro Jiménez', 'lcastro2020005@universidad.edu.gt', '5555-1005', '2002-09-12', '3045678901205', 'San José Pinula', 5, '2020-01-15'),
('2020006', 'Andrea Paola', 'Vásquez Solís', 'avasquez2020006@universidad.edu.gt', '5555-1006', '2001-01-25', '3056789012306', 'Antigua Guatemala', 6, '2020-01-15'),
('2020007', 'Roberto Carlos', 'Sánchez Luna', 'rsanchez2020007@universidad.edu.gt', '5555-1007', '2002-12-03', '3067890123407', 'Ciudad Vieja', 7, '2020-01-15'),
('2020008', 'Gabriela Isabel', 'Torres Ruiz', 'gtorres2020008@universidad.edu.gt', '5555-1008', '2001-08-18', '3078901234508', 'Jocotenango', 8, '2020-01-15'),
('2020009', 'Diego Alejandro', 'Ramírez Méndez', 'dramirez2020009@universidad.edu.gt', '5555-1009', '2002-04-07', '3089012345609', 'Chimaltenango', 9, '2020-01-15'),
('2020010', 'Stephanie Michelle', 'Mendoza Flores', 'smendoza2020010@universidad.edu.gt', '5555-1010', '2001-10-14', '3090123456710', 'San Martín Jilotepeque', 10, '2020-01-15'),

('2021001', 'Fernando José', 'López Castillo', 'flopez2021001@universidad.edu.gt', '5555-2001', '2003-06-28', '3101234567811', 'Escuintla', 11, '2021-01-15'),
('2021002', 'Valentina María', 'Gómez Díaz', 'vgomez2021002@universidad.edu.gt', '5555-2002', '2002-02-11', '3112345678912', 'Santa Lucía Cotzumalguapa', 12, '2021-01-15'),
('2021003', 'Alejandro Daniel', 'Cruz Herrera', 'acruz2021003@universidad.edu.gt', '5555-2003', '2003-09-05', '3123456789013', 'Cuilapa', 13, '2021-01-15'),
('2021004', 'Isabella Sofía', 'Aguilar Morales', 'iaguilar2021004@universidad.edu.gt', '5555-2004', '2002-12-20', '3134567890114', 'Barberena', 14, '2021-01-15'),
('2021005', 'Sebastián Andrés', 'Vargas Reyes', 'svargas2021005@universidad.edu.gt', '5555-2005', '2003-03-17', '3145678901215', 'Sololá', 15, '2021-01-15'),
('2021006', 'Camila Alejandra', 'Chávez Espinoza', 'cchavez2021006@universidad.edu.gt', '5555-2006', '2002-07-09', '3156789012316', 'Panajachel', 16, '2021-01-15'),
('2021007', 'Mateo Nicolás', 'Pineda Ordóñez', 'mpineda2021007@universidad.edu.gt', '5555-2007', '2003-11-23', '3167890123417', 'Totonicapán', 17, '2021-01-15'),
('2021008', 'Valeria Esperanza', 'Monzón Guzmán', 'vmonzon2021008@universidad.edu.gt', '5555-2008', '2002-05-16', '3178901234518', 'San Cristóbal Totonicapán', 18, '2021-01-15'),
('2021009', 'Santiago Gabriel', 'Padilla Barrios', 'spadilla2021009@universidad.edu.gt', '5555-2009', '2003-08-31', '3189012345619', 'Quetzaltenango', 19, '2021-01-15'),
('2021010', 'Lucía Fernanda', 'Arriola Coronado', 'larriola2021010@universidad.edu.gt', '5555-2010', '2002-01-04', '3190123456720', 'Salcajá', 20, '2021-01-15'),

('2022001', 'Ángel David', 'Castañeda Figueroa', 'acastaneda2022001@universidad.edu.gt', '5555-3001', '2004-10-27', '3201234567821', 'Mazatenango', 21, '2022-01-15'),
('2022002', 'Emilia Victoria', 'Galindo Ruano', 'egalindo2022002@universidad.edu.gt', '5555-3002', '2003-04-13', '3212345678922', 'Chicacao', 22, '2022-01-15'),
('2022003', 'Leonardo Esteban', 'Maldonado Portillo', 'lmaldonado2022003@universidad.edu.gt', '5555-3003', '2004-12-08', '3223456789023', 'Retalhuleu', 23, '2022-01-15'),
('2022004', 'Sofía Esperanza', 'Estrada Rivas', 'sestrada2022004@universidad.edu.gt', '5555-3004', '2003-06-21', '3234567890124', 'San Sebastián', 24, '2022-01-15'),
('2022005', 'Maximiliano José', 'Cabrera Morán', 'mcabrera2022005@universidad.edu.gt', '5555-3005', '2004-09-15', '3245678901225', 'San Marcos', 25, '2022-01-15'),
('2022006', 'Regina Maribel', 'Montenegro Sandoval', 'rmontenegro2022006@universidad.edu.gt', '5555-3006', '2003-02-28', '3256789012326', 'Malacatán', 26, '2022-01-15'),
('2022007', 'Bruno Alejandro', 'Archila Guerra', 'barchila2022007@universidad.edu.gt', '5555-3007', '2004-11-11', '3267890123427', 'Huehuetenango', 27, '2022-01-15'),
('2022008', 'Daniela Nicole', 'Muñoz Contreras', 'dmunoz2022008@universidad.edu.gt', '5555-3008', '2003-07-24', '3278901234528', 'Chiantla', 28, '2022-01-15'),
('2022009', 'Adrián Rodrigo', 'Sagastume Velásquez', 'asagastume2022009@universidad.edu.gt', '5555-3009', '2004-12-19', '3289012345629', 'Santa Cruz del Quiché', 29, '2022-01-15'),
('2022010', 'Natalia Fernanda', 'Coronado Alvarado', 'ncoronado2022010@universidad.edu.gt', '5555-3010', '2003-05-06', '3290123456730', 'Chichicastenango', 30, '2022-01-15'),

('2023001', 'Emilio Francisco', 'Moreno Paz', 'emoreno2023001@universidad.edu.gt', '5555-4001', '2005-08-12', '3301234567831', 'Salamá', 31, '2023-01-15'),
('2023002', 'Ariana Beatriz', 'Silva Jiménez', 'asilva2023002@universidad.edu.gt', '5555-4002', '2004-03-29', '3312345678932', 'Rabinal', 32, '2023-01-15'),
('2023003', 'Joaquín Sebastián', 'Herrera López', 'jherrera2023003@universidad.edu.gt', '5555-4003', '2005-10-15', '3323456789033', 'Cobán', 33, '2023-01-15'),
('2023004', 'Ximena Paola', 'Campos Martínez', 'xcampos2023004@universidad.edu.gt', '5555-4004', '2004-06-18', '3334567890134', 'San Pedro Carchá', 34, '2023-01-15'),
('2023005', 'Ricardo Andrés', 'Delgado González', 'rdelgado2023005@universidad.edu.gt', '5555-4005', '2005-01-23', '3345678901235', 'Flores', 35, '2023-01-15'),
('2023006', 'Fernanda Lucía', 'Guerrero Hernández', 'fguerrero2023006@universidad.edu.gt', '5555-4006', '2004-09-07', '3356789012336', 'San Benito', 36, '2023-01-15'),
('2023007', 'Nicolás Alejandro', 'Peña García', 'npena2023007@universidad.edu.gt', '5555-4007', '2005-04-14', '3367890123437', 'Puerto Barrios', 37, '2023-01-15'),
('2023008', 'Martina Isabel', 'Rojas Rodríguez', 'mrojas2023008@universidad.edu.gt', '5555-4008', '2004-11-21', '3378901234538', 'Livingston', 38, '2023-01-15'),
('2023009', 'Benjamín José', 'Ortega Morales', 'bortega2023009@universidad.edu.gt', '5555-4009', '2005-07-03', '3389012345639', 'Zacapa', 39, '2023-01-15'),
('2023010', 'Renata Sofía', 'Lara Castro', 'rlara2023010@universidad.edu.gt', '5555-4010', '2004-12-28', '3390123456740', 'Estanzuela', 40, '2023-01-15'),

('2024001', 'Patricio Emanuel', 'Vega Jiménez', 'pvega2024001@universidad.edu.gt', '5555-5001', '2006-02-14', '3401234567841', 'Chiquimula', 41, '2024-01-15'),
('2024002', 'Constanza María', 'Núñez Solís', 'cnunez2024002@universidad.edu.gt', '5555-5002', '2005-08-26', '3412345678942', 'Jocotán', 42, '2024-01-15'),
('2024003', 'Ignacio Andrés', 'Mendez Luna', 'imendez2024003@universidad.edu.gt', '5555-5003', '2006-05-11', '3423456789043', 'Jalapa', 43, '2024-01-15'),
('2024004', 'Antonella Paola', 'Ruiz Ruiz', 'aruiz2024004@universidad.edu.gt', '5555-5004', '2005-12-09', '3434567890144', 'San Pedro Pinula', 44, '2024-01-15'),
('2024005', 'Tomás Gabriel', 'Paredes Méndez', 'tparedes2024005@universidad.edu.gt', '5555-5005', '2006-03-25', '3445678901245', 'Jutiapa', 45, '2024-01-15'),
('2024006', 'Julieta Esperanza', 'Moreno Flores', 'jmoreno2024006@universidad.edu.gt', '5555-5006', '2005-10-16', '3456789012346', 'Asunción Mita', 46, '2024-01-15'),
('2024007', 'Salvador David', 'Figueroa Castillo', 'sfigueroa2024007@universidad.edu.gt', '5555-5007', '2006-06-02', '3467890123447', 'Guastatoja', 47, '2024-01-15'),
('2024008', 'Victoria Alejandra', 'Sandoval Díaz', 'vsandoval2024008@universidad.edu.gt', '5555-5008', '2005-01-19', '3478901234548', 'San Agustín Acasaguastlán', 48, '2024-01-15'),
('2024009', 'Cristóbal Esteban', 'Guerra Herrera', 'cguerra2024009@universidad.edu.gt', '5555-5009', '2006-09-13', '3489012345649', 'Zona 5, Ciudad de Guatemala', 1, '2024-01-15'),
('2024010', 'Esperanza Nicole', 'Contreras Morales', 'econtreras2024010@universidad.edu.gt', '5555-5010', '2005-04-30', '3490123456750', 'Zona 9, Ciudad de Guatemala', 1, '2024-01-15'),

-- Continuar con más estudiantes para llegar a 200
('2020011', 'Alexander José', 'Velásquez Alvarado', 'avelasquez2020011@universidad.edu.gt', '5555-1011', '2002-01-12', '3501234567851', 'Zona 2, Ciudad de Guatemala', 1, '2020-01-15'),
('2020012', 'Paola Beatriz', 'Paz Santos', 'ppaz2020012@universidad.edu.gt', '5555-1012', '2001-06-20', '3512345678952', 'Zona 3, Ciudad de Guatemala', 1, '2020-01-15'),
('2020013', 'Rodrigo Manuel', 'Escobar García', 'rescobar2020013@universidad.edu.gt', '5555-1013', '2002-11-25', '3523456789053', 'Zona 4, Ciudad de Guatemala', 1, '2020-01-15'),
('2020014', 'Carmen Lucía', 'Porras López', 'cporras2020014@universidad.edu.gt', '5555-1014', '2001-04-18', '3534567890154', 'Zona 6, Ciudad de Guatemala', 1, '2020-01-15'),
('2020015', 'Mauricio David', 'Barrios Martínez', 'mbarrios2020015@universidad.edu.gt', '5555-1015', '2002-08-07', '3545678901255', 'Zona 8, Ciudad de Guatemala', 1, '2020-01-15'),
('2020016', 'Alejandra Nicole', 'Fuentes González', 'afuentes2020016@universidad.edu.gt', '5555-1016', '2001-12-14', '3556789012356', 'Zona 13, Ciudad de Guatemala', 1, '2020-01-15'),
('2020017', 'Óscar Emilio', 'Najera Hernández', 'onajera2020017@universidad.edu.gt', '5555-1017', '2002-05-22', '3567890123457', 'Zona 15, Ciudad de Guatemala', 1, '2020-01-15'),
('2020018', 'Melissa Andrea', 'Dávila García', 'mdavila2020018@universidad.edu.gt', '5555-1018', '2001-09-09', '3578901234558', 'Zona 16, Ciudad de Guatemala', 1, '2020-01-15'),
('2020019', 'Enrique Gabriel', 'Córdoba Rodríguez', 'ecordoba2020019@universidad.edu.gt', '5555-1019', '2002-02-28', '3589012345659', 'Zona 17, Ciudad de Guatemala', 1, '2020-01-15'),
('2020020', 'Diana Sofía', 'Masaya Morales', 'dmasaya2020020@universidad.edu.gt', '5555-1020', '2001-07-15', '3590123456760', 'Zona 18, Ciudad de Guatemala', 1, '2020-01-15'),

-- Más estudiantes de diferentes años y carreras
('2021011', 'Kevin Rodrigo', 'Oliva Castro', 'koliva2021011@universidad.edu.gt', '5555-2011', '2003-03-05', '3601234567861', 'Mixco, San Cristóbal', 2, '2021-01-15'),
('2021012', 'Brenda Marisol', 'Franco Jiménez', 'bfranco2021012@universidad.edu.gt', '5555-2012', '2002-08-17', '3612345678962', 'Villa Nueva, Zona 1', 3, '2021-01-15'),
('2021013', 'Marco Antonio', 'Leiva Solís', 'mleiva2021013@universidad.edu.gt', '5555-2013', '2003-12-24', '3623456789063', 'Petapa, Zona 2', 4, '2021-01-15'),
('2021014', 'Kimberly Paola', 'Monroy Luna', 'kmonroy2021014@universidad.edu.gt', '5555-2014', '2002-04-11', '3634567890164', 'San José Pinula, Centro', 5, '2021-01-15'),
('2021015', 'Javier Eduardo', 'Carrillo Ruiz', 'jcarrillo2021015@universidad.edu.gt', '5555-2015', '2003-10-03', '3645678901265', 'Fraijanes', 5, '2021-01-15'),
('2021016', 'Astrid Carolina', 'Maldonado Méndez', 'amaldonado2021016@universidad.edu.gt', '5555-2016', '2002-01-29', '3656789012366', 'Amatitlán', 1, '2021-01-15'),
('2021017', 'Pablo Andrés', 'Estrada Flores', 'pestrada2021017@universidad.edu.gt', '5555-2017', '2003-06-06', '3667890123467', 'San Juan Sacatepéquez', 2, '2021-01-15'),
('2021018', 'Mónica Esperanza', 'Quezada Castillo', 'mquezada2021018@universidad.edu.gt', '5555-2018', '2002-11-13', '3678901234568', 'San Pedro Sacatepéquez', 2, '2021-01-15'),
('2021019', 'Rolando José', 'Bautista Díaz', 'rbautista2021019@universidad.edu.gt', '5555-2019', '2003-02-20', '3689012345669', 'Magdalena Milpas Altas', 2, '2021-01-15'),
('2021020', 'Tania Michelle', 'Coronado Herrera', 'tcoronado2021020@universidad.edu.gt', '5555-2020', '2002-07-27', '3690123456770', 'Santa Catarina Barahona', 2, '2021-01-15'),

-- Estudiantes adicionales para completar una buena muestra
('2022011', 'Hugo Alejandro', 'Villanueva Morales', 'hvillanueva2022011@universidad.edu.gt', '5555-3011', '2004-04-08', '3701234567871', 'Palin', 4, '2022-01-15'),
('2022012', 'Karla Stefany', 'Montenegro Reyes', 'kmontenegro2022012@universidad.edu.gt', '5555-3012', '2003-09-14', '3712345678972', 'San Vicente Pacaya', 4, '2022-01-15'),
('2022013', 'Nelson Eduardo', 'Cabrera Espinoza', 'ncabrera2022013@universidad.edu.gt', '5555-3013', '2004-01-21', '3723456789073', 'Palencia', 1, '2022-01-15'),
('2022014', 'Andrea Gabriela', 'Archila Ordóñez', 'aarchila2022014@universidad.edu.gt', '5555-3014', '2003-05-28', '3734567890174', 'Chinautla', 1, '2022-01-15'),
('2022015', 'Cristian Roberto', 'Muñoz Guzmán', 'cmunoz2022015@universidad.edu.gt', '5555-3015', '2004-10-05', '3745678901275', 'San Pedro Ayampuc', 1, '2022-01-15'),
('2022016', 'Dulce María', 'Sagastume Barrios', 'dsagastume2022016@universidad.edu.gt', '5555-3016', '2003-03-12', '3756789012376', 'San Raymundo', 1, '2022-01-15'),
('2022017', 'Giovanni Estuardo', 'Coronado Coronado', 'gcoronado2022017@universidad.edu.gt', '5555-3017', '2004-08-19', '3767890123477', 'Chuarrancho', 1, '2022-01-15'),
('2022018', 'Jessica Maribel', 'Paz Figueroa', 'jpaz2022018@universidad.edu.gt', '5555-3018', '2003-12-26', '3778901234578', 'San Bartolomé Milpas Altas', 2, '2022-01-15'),
('2022019', 'Julio César', 'Santos Ruano', 'jsantos2022019@universidad.edu.gt', '5555-3019', '2004-06-02', '3789012345679', 'Santa María de Jesús', 2, '2022-01-15'),
('2022020', 'Lesly Vanessa', 'Jiménez Portillo', 'ljimenez2022020@universidad.edu.gt', '5555-3020', '2003-11-09', '3790123456780', 'Santiago Sacatepéquez', 2, '2022-01-15'),

-- Estudiantes de 2023 adicionales
('2023011', 'Edwin Mauricio', 'López Rivas', 'elopez2023011@universidad.edu.gt', '5555-4011', '2005-02-16', '3801234567881', 'Santo Domingo Xenacoj', 2, '2023-01-15'),
('2023012', 'Cindy Alejandra', 'García Morán', 'cgarcia2023012@universidad.edu.gt', '5555-4012', '2004-07-23', '3812345678982', 'San Antonio Aguas Calientes', 2, '2023-01-15'),
('2023013', 'Oscar David', 'Rodríguez Sandoval', 'orodriguez2023013@universidad.edu.gt', '5555-4013', '2005-12-01', '3823456789083', 'Santa Catarina Pinula', 1, '2023-01-15'),
('2023014', 'Wendy Carolina', 'Martínez Guerra', 'wmartinez2023014@universidad.edu.gt', '5555-4014', '2004-04-08', '3834567890184', 'San Miguel Petapa', 4, '2023-01-15'),
('2023015', 'José Rodrigo', 'Hernández Contreras', 'jhernandez2023015@universidad.edu.gt', '5555-4015', '2005-09-15', '3845678901285', 'Villa Canales', 1, '2023-01-15'),
('2023016', 'Priscila Beatriz', 'Castro Velásquez', 'pcastro2023016@universidad.edu.gt', '5555-4016', '2004-01-22', '3856789012386', 'Boca del Monte', 1, '2023-01-15'),
('2023017', 'William Alexander', 'Jiménez Alvarado', 'wjimenez2023017@universidad.edu.gt', '5555-4017', '2005-06-29', '3867890123487', 'Fraijanes Centro', 5, '2023-01-15'),
('2023018', 'Evelyn Marisol', 'Solís Paz', 'esolis2023018@universidad.edu.gt', '5555-4018', '2004-11-05', '3878901234588', 'Santa Rosa de Lima', 5, '2023-01-15'),
('2023019', 'Daniel Estuardo', 'Luna Santos', 'dluna2023019@universidad.edu.gt', '5555-4019', '2005-03-14', '3889012345689', 'Casillas', 5, '2023-01-15'),
('2023020', 'María Fernanda', 'Ruiz Jiménez', 'mruiz2023020@universidad.edu.gt', '5555-4020', '2004-08-21', '3890123456790', 'Nueva Santa Rosa', 5, '2023-01-15'),

-- Estudiantes de 2024 adicionales
('2024011', 'Anthony José', 'Méndez Solís', 'amendez2024011@universidad.edu.gt', '5555-5011', '2006-01-07', '3901234567891', 'Oratorio', 5, '2024-01-15'),
('2024012', 'Ingrid Stephanie', 'Flores Luna', 'iflores2024012@universidad.edu.gt', '5555-5012', '2005-05-14', '3912345678992', 'Taxisco', 5, '2024-01-15'),
('2024013', 'Brandon Esteban', 'Castillo Ruiz', 'bcastillo2024013@universidad.edu.gt', '5555-5013', '2006-10-21', '3923456789093', 'Pueblo Nuevo Viñas', 5, '2024-01-15'),
('2024014', 'Sharon Nicole', 'Díaz Méndez', 'sdiaz2024014@universidad.edu.gt', '5555-5014', '2005-02-28', '3934567890194', 'San Rafael Las Flores', 5, '2024-01-15'),
('2024015', 'Kevin Daniel', 'Herrera Flores', 'kherrera2024015@universidad.edu.gt', '5555-5015', '2006-07-04', '3945678901295', 'Chiquimulilla', 5, '2024-01-15'),
('2024016', 'Ashley Paola', 'Morales Castillo', 'amorales2024016@universidad.edu.gt', '5555-5016', '2005-12-11', '3956789012396', 'Guazacapán', 5, '2024-01-15'),
('2024017', 'Bryan Eduardo', 'García Díaz', 'bgarcia2024017@universidad.edu.gt', '5555-5017', '2006-04-18', '3967890123497', 'San Juan Tecuaco', 5, '2024-01-15'),
('2024018', 'Allison María', 'López Herrera', 'alopez2024018@universidad.edu.gt', '5555-5018', '2005-09-25', '3978901234598', 'Moyuta', 21, '2024-01-15'),
('2024019', 'Javier Emilio', 'Rodríguez Morales', 'jrodriguez2024019@universidad.edu.gt', '5555-5019', '2006-01-02', '3989012345699', 'Conguaco', 21, '2024-01-15'),
('2024020', 'Britany Sofía', 'Martínez García', 'bmartinez2024020@universidad.edu.gt', '5555-5020', '2005-06-09', '3990123456700', 'Pasaco', 21, '2024-01-15');

-- ====================================
-- INSCRIPCIONES DE CARRERA
-- ====================================

-- Inscribir estudiantes en diferentes carreras
INSERT INTO inscripciones_carrera (estudiante_id, carrera_id, semestre_actual) VALUES
-- Estudiantes de 2020 (9no semestre)
(1, 1, 9),   -- José María - CC
(2, 7, 7),   -- Ana Sofía - Administración
(3, 1, 9),   -- Carlos Eduardo - CC
(4, 2, 9),   -- María José - Industrial
(5, 3, 9),   -- Luis Fernando - Civil
(6, 11, 9),  -- Andrea Paola - Medicina
(7, 1, 9),   -- Roberto Carlos - CC
(8, 7, 7),   -- Gabriela Isabel - Administración
(9, 2, 9),   -- Diego Alejandro - Industrial
(10, 19, 9), -- Stephanie Michelle - Psicología

-- Estudiantes de 2021 (7mo semestre)
(11, 1, 7),  -- Fernando José - CC
(12, 8, 7),  -- Valentina María - CPA
(13, 3, 7),  -- Alejandro Daniel - Civil
(14, 11, 7), -- Isabella Sofía - Medicina
(15, 4, 7),  -- Sebastián Andrés - Electrónica
(16, 7, 7),  -- Camila Alejandra - Administración
(17, 2, 7),  -- Mateo Nicolás - Industrial
(18, 1, 7),  -- Valeria Esperanza - CC
(19, 5, 7),  -- Santiago Gabriel - Mecánica
(20, 15, 7), -- Lucía Fernanda - Derecho

-- Estudiantes de 2022 (5to semestre)
(21, 1, 5),  -- Ángel David - CC
(22, 7, 5),  -- Emilia Victoria - Administración
(23, 6, 5),  -- Leonardo Esteban - Química
(24, 11, 5), -- Sofía Esperanza - Medicina
(25, 2, 5),  -- Maximiliano José - Industrial
(26, 17, 5), -- Regina Maribel - Arquitectura
(27, 1, 5),  -- Bruno Alejandro - CC
(28, 12, 5), -- Daniela Nicole - Enfermería
(29, 3, 5),  -- Adrián Rodrigo - Civil
(30, 19, 5), -- Natalia Fernanda - Psicología

-- Estudiantes de 2023 (3er semestre)
(31, 1, 3),  -- Emilio Francisco - CC
(32, 7, 3),  -- Ariana Beatriz - Administración
(33, 2, 3),  -- Joaquín Sebastián - Industrial
(34, 11, 3), -- Ximena Paola - Medicina
(35, 4, 3),  -- Ricardo Andrés - Electrónica
(36, 23, 3), -- Fernanda Lucía - Biología
(37, 1, 3),  -- Nicolás Alejandro - CC
(38, 13, 3), -- Martina Isabel - Nutrición
(39, 3, 3),  -- Benjamín José - Civil
(40, 20, 3), -- Renata Sofía - Pedagogía

-- Estudiantes de 2024 (1er semestre)
(41, 1, 1),  -- Patricio Emanuel - CC
(42, 7, 1),  -- Constanza María - Administración
(43, 2, 1),  -- Ignacio Andrés - Industrial
(44, 11, 1), -- Antonella Paola - Medicina
(45, 3, 1),  -- Tomás Gabriel - Civil
(46, 17, 1), -- Julieta Esperanza - Arquitectura
(47, 1, 1),  -- Salvador David - CC
(48, 19, 1), -- Victoria Alejandra - Psicología
(49, 5, 1),  -- Cristóbal Esteban - Mecánica
(50, 15, 1), -- Esperanza Nicole - Derecho

-- Más inscripciones para completar 100 estudiantes
(51, 1, 9),  -- Alexander José - CC
(52, 2, 7),  -- Paola Beatriz - Industrial
(53, 3, 9),  -- Rodrigo Manuel - Civil
(54, 7, 7),  -- Carmen Lucía - Administración
(55, 1, 9),  -- Mauricio David - CC
(56, 11, 9), -- Alejandra Nicole - Medicina
(57, 2, 9),  -- Óscar Emilio - Industrial
(58, 8, 7),  -- Melissa Andrea - CPA
(59, 1, 9),  -- Enrique Gabriel - CC
(60, 7, 7),  -- Diana Sofía - Administración

(61, 1, 7),  -- Kevin Rodrigo - CC
(62, 2, 7),  -- Brenda Marisol - Industrial
(63, 3, 7),  -- Marco Antonio - Civil
(64, 11, 7), -- Kimberly Paola - Medicina
(65, 4, 7),  -- Javier Eduardo - Electrónica
(66, 7, 7),  -- Astrid Carolina - Administración
(67, 1, 7),  -- Pablo Andrés - CC
(68, 12, 7), -- Mónica Esperanza - Enfermería
(69, 2, 7),  -- Rolando José - Industrial
(70, 15, 7), -- Tania Michelle - Derecho

(71, 1, 5),  -- Hugo Alejandro - CC
(72, 7, 5),  -- Karla Stefany - Administración
(73, 2, 5),  -- Nelson Eduardo - Industrial
(74, 11, 5), -- Andrea Gabriela - Medicina
(75, 3, 5),  -- Cristian Roberto - Civil
(76, 17, 5), -- Dulce María - Arquitectura
(77, 1, 5),  -- Giovanni Estuardo - CC
(78, 19, 5), -- Jessica Maribel - Psicología
(79, 5, 5),  -- Julio César - Mecánica
(80, 8, 5),  -- Lesly Vanessa - CPA

(81, 1, 3),  -- Edwin Mauricio - CC
(82, 7, 3),  -- Cindy Alejandra - Administración
(83, 2, 3),  -- Oscar David - Industrial
(84, 11, 3), -- Wendy Carolina - Medicina
(85, 3, 3),  -- José Rodrigo - Civil
(86, 18, 3), -- Priscila Beatriz - Diseño Gráfico
(87, 1, 3),  -- William Alexander - CC
(88, 13, 3), -- Evelyn Marisol - Nutrición
(89, 4, 3),  -- Daniel Estuardo - Electrónica
(90, 20, 3), -- María Fernanda - Pedagogía

(91, 1, 1),  -- Anthony José - CC
(92, 7, 1),  -- Ingrid Stephanie - Administración
(93, 2, 1),  -- Brandon Esteban - Industrial
(94, 11, 1), -- Sharon Nicole - Medicina
(95, 3, 1),  -- Kevin Daniel - Civil
(96, 17, 1), -- Ashley Paola - Arquitectura
(97, 1, 1),  -- Bryan Eduardo - CC
(98, 12, 1), -- Allison María - Enfermería
(99, 5, 1),  -- Javier Emilio - Mecánica
(100, 9, 1); -- Britany Sofía - Economía

-- ====================================
-- BECAS
-- ====================================

INSERT INTO becas (nombre, descripcion, monto, porcentaje_cobertura, requisitos) VALUES
('Beca Excelencia Académica', 'Para estudiantes con promedio superior a 85 puntos', 5000.00, 100.00, 'Promedio mínimo 85, carta de recomendación'),
('Beca de Mérito Deportivo', 'Para estudiantes destacados en deportes', 3000.00, 60.00, 'Participación en equipos representativos'),
('Beca Socioeconómica', 'Apoyo para estudiantes de escasos recursos', 2500.00, 50.00, 'Estudio socioeconómico, promedio mínimo 70'),
('Beca de Investigación', 'Para estudiantes participantes en proyectos de investigación', 4000.00, 80.00, 'Participación activa en proyecto de investigación'),
('Beca Internacional', 'Para programas de intercambio', 8000.00, 100.00, 'Promedio mínimo 80, dominio de idioma extranjero'),
('Beca Pueblos Indígenas', 'Apoyo a estudiantes de comunidades indígenas', 3500.00, 70.00, 'Certificación de pertenencia a comunidad indígena'),
('Beca Liderazgo Estudiantil', 'Para líderes estudiantiles destacados', 2000.00, 40.00, 'Participación en gobierno estudiantil'),
('Beca Emprendimiento', 'Para estudiantes con proyectos emprendedores', 4500.00, 90.00, 'Proyecto emprendedor viable, plan de negocios');

-- ====================================
-- ESTUDIANTES CON BECAS
-- ====================================

INSERT INTO estudiante_becas (estudiante_id, beca_id, fecha_otorgamiento, fecha_vencimiento, monto_otorgado) VALUES
(1, 1, '2020-02-01', '2024-12-31', 5000.00),
(6, 1, '2020-02-01', '2024-12-31', 5000.00),
(11, 1, '2021-02-01', '2025-12-31', 5000.00),
(21, 3, '2022-02-01', '2026-12-31', 2500.00),
(31, 3, '2023-02-01', '2027-12-31', 2500.00),
(2, 2, '2020-03-01', '2024-12-31', 3000.00),
(7, 4, '2020-08-01', '2024-12-31', 4000.00),
(12, 2, '2021-03-01', '2025-12-31', 3000.00),
(17, 4, '2021-08-01', '2025-12-31', 4000.00),
(22, 6, '2022-02-01', '2026-12-31', 3500.00),
(32, 7, '2023-09-01', '2027-12-31', 2000.00),
(41, 3, '2024-02-01', '2028-12-31', 2500.00),
(46, 8, '2024-10-01', '2028-12-31', 4500.00),
(51, 1, '2020-02-01', '2024-12-31', 5000.00),
(61, 1, '2021-02-01', '2025-12-31', 5000.00);

-- ====================================
-- SECCIONES (CICLOS 2024 Y 2025)
-- ====================================

INSERT INTO secciones (materia_id, profesor_id, codigo_seccion, ciclo, cupo_maximo, modalidad, horario, aula, fecha_inicio, fecha_fin) VALUES
-- Ciclo 2024-2
(1, 9, 'A', '2024-2', 35, 'presencial', 'Lunes y Miércoles 7:00-9:00', 'T1-101', '2024-07-15', '2024-11-15'),
(1, 10, 'B', '2024-2', 35, 'presencial', 'Martes y Jueves 7:00-9:00', 'T1-102', '2024-07-15', '2024-11-15'),
(2, 9, 'A', '2024-2', 35, 'presencial', 'Lunes y Miércoles 9:00-11:00', 'T1-103', '2024-07-15', '2024-11-15'),
(3, 10, 'A', '2024-2', 35, 'presencial', 'Martes y Jueves 9:00-11:00', 'T1-201', '2024-07-15', '2024-11-15'),
(4, 10, 'A', '2024-2', 30, 'presencial', 'Lunes, Miércoles y Viernes 11:00-12:00', 'T1-202', '2024-07-15', '2024-11-15'),
(5, 10, 'A', '2024-2', 30, 'presencial', 'Martes, Jueves y Sábado 11:00-12:00', 'T1-301', '2024-07-15', '2024-11-15'),

-- Programación
(11, 1, 'A', '2024-2', 25, 'presencial', 'Lunes y Miércoles 13:00-16:00', 'CC-01', '2024-07-15', '2024-11-15'),
(11, 2, 'B', '2024-2', 25, 'presencial', 'Martes y Jueves 13:00-16:00', 'CC-02', '2024-07-15', '2024-11-15'),
(12, 1, 'A', '2024-2', 25, 'presencial', 'Lunes y Miércoles 16:00-19:00', 'CC-01', '2024-07-15', '2024-11-15'),
(13, 3, 'A', '2024-2', 25, 'presencial', 'Martes y Jueves 16:00-19:00', 'CC-02', '2024-07-15', '2024-11-15'),
(14, 2, 'A', '2024-2', 30, 'presencial', 'Lunes y Miércoles 19:00-21:00', 'T3-301', '2024-07-15', '2024-11-15'),
(15, 2, 'A', '2024-2', 30, 'presencial', 'Martes y Jueves 19:00-21:00', 'T3-401', '2024-07-15', '2024-11-15'),

-- Administración
(31, 21, 'A', '2024-2', 40, 'presencial', 'Lunes y Miércoles 7:00-9:00', 'T3-101', '2024-07-15', '2024-11-15'),
(32, 21, 'A', '2024-2', 40, 'presencial', 'Martes y Jueves 7:00-9:00', 'T3-102', '2024-07-15', '2024-11-15'),
(33, 20, 'A', '2024-2', 45, 'presencial', 'Lunes y Miércoles 9:00-11:00', 'T3-101', '2024-07-15', '2024-11-15'),
(34, 20, 'A', '2024-2', 45, 'presencial', 'Martes y Jueves 9:00-11:00', 'T3-102', '2024-07-15', '2024-11-15'),

-- Industrial
(21, 11, 'A', '2024-2', 35, 'presencial', 'Lunes y Miércoles 11:00-13:00', 'T1-401', '2024-07-15', '2024-11-15'),
(22, 11, 'A', '2024-2', 35, 'presencial', 'Martes y Jueves 11:00-13:00', 'T3-201', '2024-07-15', '2024-11-15'),
(23, 12, 'A', '2024-2', 30, 'presencial', 'Viernes 13:00-16:00', 'T3-201', '2024-07-15', '2024-11-15'),

-- Medicina (básicas)
(37, 25, 'A', '2024-2', 20, 'presencial', 'Lunes a Viernes 7:00-11:00', 'M1-101', '2024-07-15', '2024-11-15'),
(38, 26, 'A', '2024-2', 20, 'presencial', 'Lunes a Viernes 11:00-15:00', 'M1-102', '2024-07-15', '2024-11-15'),
(39, 26, 'A', '2024-2', 20, 'presencial', 'Lunes a Viernes 15:00-18:00', 'M1-201', '2024-07-15', '2024-11-15'),

-- Ciclo 2025-1 (actual)
(1, 9, 'A', '2025-1', 35, 'presencial', 'Lunes y Miércoles 7:00-9:00', 'T1-101', '2025-01-15', '2025-05-15'),
(1, 10, 'B', '2025-1', 35, 'presencial', 'Martes y Jueves 7:00-9:00', 'T1-102', '2025-01-15', '2025-05-15'),
(1, 9, 'C', '2025-1', 35, 'virtual', 'Sábados 8:00-12:00', 'Virtual', '2025-01-15', '2025-05-15'),
(2, 9, 'A', '2025-1', 35, 'presencial', 'Lunes y Miércoles 9:00-11:00', 'T1-103', '2025-01-15', '2025-05-15'),
(2, 10, 'B', '2025-1', 35, 'presencial', 'Martes y Jueves 9:00-11:00', 'T1-201', '2025-01-15', '2025-05-15'),
(3, 10, 'A', '2025-1', 35, 'presencial', 'Lunes y Miércoles 11:00-13:00', 'T1-202', '2025-01-15', '2025-05-15'),

-- Programación 2025-1
(11, 1, 'A', '2025-1', 25, 'presencial', 'Lunes y Miércoles 13:00-16:00', 'CC-01', '2025-01-15', '2025-05-15'),
(11, 2, 'B', '2025-1', 25, 'presencial', 'Martes y Jueves 13:00-16:00', 'CC-02', '2025-01-15', '2025-05-15'),
(11, 8, 'C', '2025-1', 25, 'hibrido', 'Viernes 13:00-19:00', 'CC-03', '2025-01-15', '2025-05-15'),
(12, 1, 'A', '2025-1', 25, 'presencial', 'Lunes y Miércoles 16:00-19:00', 'CC-01', '2025-01-15', '2025-05-15'),
(12, 4, 'B', '2025-1', 25, 'presencial', 'Martes y Jueves 16:00-19:00', 'CC-02', '2025-01-15', '2025-05-15'),
(13, 3, 'A', '2025-1', 25, 'presencial', 'Lunes y Miércoles 19:00-22:00', 'CC-01', '2025-01-15', '2025-05-15'),
(13, 7, 'B', '2025-1', 25, 'presencial', 'Martes y Jueves 19:00-22:00', 'CC-02', '2025-01-15', '2025-05-15'),

-- Base de Datos 2025-1
(14, 2, 'A', '2025-1', 30, 'presencial', 'Lunes y Miércoles 19:00-21:00', 'T3-301', '2025-01-15', '2025-05-15'),
(14, 3, 'B', '2025-1', 30, 'presencial', 'Martes y Jueves 19:00-21:00', 'T3-401', '2025-01-15', '2025-05-15'),
(15, 2, 'A', '2025-1', 30, 'presencial', 'Viernes 17:00-21:00', 'T3-301', '2025-01-15', '2025-05-15'),

-- Más secciones para tener variedad
(16, 7, 'A', '2025-1', 35, 'presencial', 'Martes y Jueves 13:00-15:00', 'T1-301', '2025-01-15', '2025-05-15'),
(17, 6, 'A', '2025-1', 35, 'presencial', 'Lunes y Miércoles 15:00-17:00', 'T1-301', '2025-01-15', '2025-05-15'),
(18, 4, 'A', '2025-1', 30, 'presencial', 'Viernes 13:00-17:00', 'T3-201', '2025-01-15', '2025-05-15'),

-- Administración 2025-1
(31, 21, 'A', '2025-1', 40, 'presencial', 'Lunes y Miércoles 7:00-9:00', 'T3-101', '2025-01-15', '2025-05-15'),
(31, 21, 'B', '2025-1', 40, 'presencial', 'Martes y Jueves 7:00-9:00', 'T3-102', '2025-01-15', '2025-05-15'),
(32, 21, 'A', '2025-1', 40, 'presencial', 'Lunes y Miércoles 9:00-11:00', 'T3-101', '2025-01-15', '2025-05-15'),
(33, 20, 'A', '2025-1', 45, 'presencial', 'Martes y Jueves 9:00-11:00', 'T3-102', '2025-01-15', '2025-05-15'),
(34, 20, 'A', '2025-1', 45, 'presencial', 'Lunes y Miércoles 11:00-13:00', 'T3-101', '2025-01-15', '2025-05-15'),
(35, 22, 'A', '2025-1', 40, 'presencial', 'Martes y Jueves 11:00-13:00', 'T3-102', '2025-01-15', '2025-05-15'),

-- Industrial 2025-1
(21, 11, 'A', '2025-1', 35, 'presencial', 'Lunes y Miércoles 13:00-15:00', 'T1-401', '2025-01-15', '2025-05-15'),
(22, 11, 'A', '2025-1', 35, 'presencial', 'Martes y Jueves 13:00-15:00', 'T3-201', '2025-01-15', '2025-05-15'),
(23, 12, 'A', '2025-1', 30, 'presencial', 'Viernes 15:00-18:00', 'T3-201', '2025-01-15', '2025-05-15'),
(24, 13, 'A', '2025-1', 30, 'presencial', 'Sábados 7:00-10:00', 'T3-201', '2025-01-15', '2025-05-15'),

-- Medicina 2025-1
(37, 25, 'A', '2025-1', 20, 'presencial', 'Lunes a Viernes 7:00-11:00', 'M1-101', '2025-01-15', '2025-05-15'),
(38, 25, 'A', '2025-1', 20, 'presencial', 'Lunes a Viernes 11:00-15:00', 'M1-102', '2025-01-15', '2025-05-15'),
(39, 26, 'A', '2025-1', 20, 'presencial', 'Lunes a Viernes 15:00-18:00', 'M1-201', '2025-01-15', '2025-05-15'),
(40, 26, 'A', '2025-1', 20, 'presencial', 'Lunes a Viernes 18:00-21:00', 'M1-202', '2025-01-15', '2025-05-15'),

-- Materias de servicio
(46, 30, 'A', '2025-1', 50, 'presencial', 'Lunes 7:00-9:00', 'T3-101', '2025-01-15', '2025-05-15'),
(46, 30, 'B', '2025-1', 50, 'presencial', 'Miércoles 7:00-9:00', 'T3-102', '2025-01-15', '2025-05-15'),
(49, 24, 'A', '2025-1', 45, 'presencial', 'Viernes 19:00-22:00', 'T3-101', '2025-01-15', '2025-05-15'),
(52, 30, 'A', '2025-1', 40, 'presencial', 'Sábados 7:00-10:00', 'T3-102', '2025-01-15', '2025-05-15');

-- ====================================
-- INSCRIPCIONES EN SECCIONES 
-- ====================================

-- Inscripciones del ciclo 2024-2 (ya finalizadas con notas)
INSERT INTO inscripciones (estudiante_id, seccion_id, fecha_inscripcion, nota_final, estado) VALUES
-- Matemática I - Sección A (2024-2)
(1, 1, '2024-07-10', 78.50, 'aprobado'),
(3, 1, '2024-07-10', 82.00, 'aprobado'),
(7, 1, '2024-07-10', 65.75, 'aprobado'),
(51, 1, '2024-07-10', 88.25, 'aprobado'),
(55, 1, '2024-07-10', 72.50, 'aprobado'),
(59, 1, '2024-07-10', 91.00, 'aprobado'),
(41, 1, '2024-07-10', 45.00, 'reprobado'),
(43, 1, '2024-07-10', 58.25, 'reprobado'),
(47, 1, '2024-07-10', 67.75, 'aprobado'),

-- Matemática I - Sección B (2024-2)
(2, 2, '2024-07-10', 85.00, 'aprobado'),
(4, 2, '2024-07-10', 79.50, 'aprobado'),
(8, 2, '2024-07-10', 73.25, 'aprobado'),
(52, 2, '2024-07-10', 86.75, 'aprobado'),
(56, 2, '2024-07-10', 68.00, 'aprobado'),
(60, 2, '2024-07-10', 92.50, 'aprobado'),
(42, 2, '2024-07-10', 55.75, 'reprobado'),
(44, 2, '2024-07-10', 61.25, 'aprobado'),

-- Introducción a la Programación - Sección A (2024-2)
(1, 7, '2024-07-10', 89.00, 'aprobado'),
(3, 7, '2024-07-10', 76.50, 'aprobado'),
(7, 7, '2024-07-10', 93.25, 'aprobado'),
(21, 7, '2024-07-10', 84.75, 'aprobado'),
(27, 7, '2024-07-10', 78.00, 'aprobado'),
(31, 7, '2024-07-10', 87.50, 'aprobado'),
(37, 7, '2024-07-10', 91.25, 'aprobado'),
(41, 7, '2024-07-10', 62.00, 'aprobado'),
(47, 7, '2024-07-10', 85.75, 'aprobado'),

-- Introducción a la Programación - Sección B (2024-2)
(11, 8, '2024-07-10', 82.50, 'aprobado'),
(17, 8, '2024-07-10', 88.75, 'aprobado'),
(61, 8, '2024-07-10', 79.25, 'aprobado'),
(67, 8, '2024-07-10', 94.00, 'aprobado'),
(71, 8, '2024-07-10', 76.50, 'aprobado'),
(77, 8, '2024-07-10', 83.25, 'aprobado'),
(81, 8, '2024-07-10', 90.75, 'aprobado'),
(87, 8, '2024-07-10', 74.00, 'aprobado'),

-- POO - Sección A (2024-2)
(1, 9, '2024-07-10', 85.50, 'aprobado'),
(7, 9, '2024-07-10', 91.75, 'aprobado'),
(21, 9, '2024-07-10', 78.25, 'aprobado'),
(27, 9, '2024-07-10', 88.00, 'aprobado'),
(37, 9, '2024-07-10', 82.75, 'aprobado'),
(47, 9, '2024-07-10', 76.50, 'aprobado'),
(51, 9, '2024-07-10', 93.25, 'aprobado'),
(59, 9, '2024-07-10', 89.00, 'aprobado'),

-- Contabilidad I - Sección A (2024-2)
(2, 13, '2024-07-10', 77.50, 'aprobado'),
(8, 13, '2024-07-10', 84.25, 'aprobado'),
(12, 13, '2024-07-10', 81.75, 'aprobado'),
(16, 13, '2024-07-10', 75.00, 'aprobado'),
(20, 13, '2024-07-10', 88.50, 'aprobado'),
(22, 13, '2024-07-10', 79.25, 'aprobado'),
(32, 13, '2024-07-10', 86.75, 'aprobado'),
(42, 13, '2024-07-10', 73.00, 'aprobado'),

-- Anatomía Humana I - Sección A (2024-2)
(6, 18, '2024-07-10', 92.00, 'aprobado'),
(14, 18, '2024-07-10', 87.75, 'aprobado'),
(24, 18, '2024-07-10', 89.50, 'aprobado'),
(34, 18, '2024-07-10', 85.25, 'aprobado'),
(44, 18, '2024-07-10', 78.75, 'aprobado'),
(56, 18, '2024-07-10', 91.25, 'aprobado'),
(64, 18, '2024-07-10', 83.50, 'aprobado'),
(74, 18, '2024-07-10', 88.00, 'aprobado'),

-- ====================================
-- INSCRIPCIONES CICLO 2025-1 (ACTUAL)
-- ====================================

-- Matemática I - Sección A (2025-1) - Estudiantes nuevos principalmente
INSERT INTO inscripciones (estudiante_id, seccion_id, fecha_inscripcion, estado) VALUES
(91, 21, '2025-01-10', 'inscrito'), -- Anthony José
(93, 21, '2025-01-10', 'inscrito'), -- Brandon Esteban
(95, 21, '2025-01-10', 'inscrito'), -- Kevin Daniel
(97, 21, '2025-01-10', 'inscrito'), -- Bryan Eduardo
(99, 21, '2025-01-10', 'inscrito'), -- Javier Emilio
(41, 21, '2025-01-10', 'inscrito'), -- Patricio Emanuel (repitiendo)
(43, 21, '2025-01-10', 'inscrito'), -- Ignacio Andrés (repitiendo)
(45, 21, '2025-01-10', 'inscrito'), -- Tomás Gabriel
(49, 21, '2025-01-10', 'inscrito'), -- Cristóbal Esteban

-- Matemática I - Sección B (2025-1)
(92, 22, '2025-01-10', 'inscrito'), -- Ingrid Stephanie
(94, 22, '2025-01-10', 'inscrito'), -- Sharon Nicole
(96, 22, '2025-01-10', 'inscrito'), -- Ashley Paola
(98, 22, '2025-01-10', 'inscrito'), -- Allison María
(100, 22, '2025-01-10', 'inscrito'), -- Britany Sofía
(42, 22, '2025-01-10', 'inscrito'), -- Constanza María (repitiendo)
(46, 22, '2025-01-10', 'inscrito'), -- Julieta Esperanza
(48, 22, '2025-01-10', 'inscrito'), -- Victoria Alejandra
(50, 22, '2025-01-10', 'inscrito'), -- Esperanza Nicole

-- Matemática II - Sección A (2025-1) - Estudiantes de segundo semestre
(31, 25, '2025-01-10', 'inscrito'), -- Emilio Francisco
(33, 25, '2025-01-10', 'inscrito'), -- Joaquín Sebastián
(35, 25, '2025-01-10', 'inscrito'), -- Ricardo Andrés
(37, 25, '2025-01-10', 'inscrito'), -- Nicolás Alejandro
(39, 25, '2025-01-10', 'inscrito'), -- Benjamín José
(81, 25, '2025-01-10', 'inscrito'), -- Edwin Mauricio
(83, 25, '2025-01-10', 'inscrito'), -- Oscar David
(85, 25, '2025-01-10', 'inscrito'), -- José Rodrigo

-- Introducción a la Programación - Sección A (2025-1)
(91, 27, '2025-01-10', 'inscrito'), -- Anthony José
(95, 27, '2025-01-10', 'inscrito'), -- Kevin Daniel
(97, 27, '2025-01-10', 'inscrito'), -- Bryan Eduardo
(41, 27, '2025-01-10', 'inscrito'), -- Patricio Emanuel
(43, 27, '2025-01-10', 'inscrito'), -- Ignacio Andrés
(45, 27, '2025-01-10', 'inscrito'), -- Tomás Gabriel
(47, 27, '2025-01-10', 'inscrito'), -- Salvador David

-- Introducción a la Programación - Sección B (2025-1)
(71, 28, '2025-01-10', 'inscrito'), -- Hugo Alejandro
(77, 28, '2025-01-10', 'inscrito'), -- Giovanni Estuardo
(81, 28, '2025-01-10', 'inscrito'), -- Edwin Mauricio
(87, 28, '2025-01-10', 'inscrito'), -- William Alexander
(31, 28, '2025-01-10', 'inscrito'), -- Emilio Francisco
(37, 28, '2025-01-10', 'inscrito'), -- Nicolás Alejandro

-- POO - Sección A (2025-1) - Estudiantes avanzados
(11, 30, '2025-01-10', 'inscrito'), -- Fernando José
(17, 30, '2025-01-10', 'inscrito'), -- Mateo Nicolás
(18, 30, '2025-01-10', 'inscrito'), -- Valeria Esperanza
(61, 30, '2025-01-10', 'inscrito'), -- Kevin Rodrigo
(67, 30, '2025-01-10', 'inscrito'), -- Pablo Andrés
(71, 30, '2025-01-10', 'inscrito'), -- Hugo Alejandro
(77, 30, '2025-01-10', 'inscrito'), -- Giovanni Estuardo

-- Estructura de Datos - Sección A (2025-1)
(1, 32, '2025-01-10', 'inscrito'), -- José María (semestre avanzado)
(3, 32, '2025-01-10', 'inscrito'), -- Carlos Eduardo
(7, 32, '2025-01-10', 'inscrito'), -- Roberto Carlos
(21, 32, '2025-01-10', 'inscrito'), -- Ángel David
(27, 32, '2025-01-10', 'inscrito'), -- Bruno Alejandro
(51, 32, '2025-01-10', 'inscrito'), -- Alexander José
(55, 32, '2025-01-10', 'inscrito'), -- Mauricio David
(59, 32, '2025-01-10', 'inscrito'), -- Enrique Gabriel

-- Contabilidad I - Sección A (2025-1)
(92, 49, '2025-01-10', 'inscrito'), -- Ingrid Stephanie
(100, 49, '2025-01-10', 'inscrito'), -- Britany Sofía
(42, 49, '2025-01-10', 'inscrito'), -- Constanza María
(72, 49, '2025-01-10', 'inscrito'), -- Karla Stefany
(82, 49, '2025-01-10', 'inscrito'), -- Cindy Alejandra
(32, 49, '2025-01-10', 'inscrito'), -- Ariana Beatriz

-- Anatomía Humana I - Sección A (2025-1)
(94, 57, '2025-01-10', 'inscrito'), -- Sharon Nicole
(44, 57, '2025-01-10', 'inscrito'), -- Antonella Paola
(34, 57, '2025-01-10', 'inscrito'), -- Ximena Paola
(84, 57, '2025-01-10', 'inscrito'), -- Wendy Carolina
(74, 57, '2025-01-10', 'inscrito'), -- Andrea Gabriela
(64, 57, '2025-01-10', 'inscrito'), -- Kimberly Paola

-- ====================================
-- EVALUACIONES POR SECCIÓN
-- ====================================

-- Evaluaciones para Matemática I - Sección A (2025-1)
INSERT INTO evaluaciones (seccion_id, nombre, tipo, ponderacion, fecha_evaluacion, descripcion) VALUES
(21, 'Primer Parcial', 'parcial', 25.00, '2025-03-15', 'Álgebra básica y ecuaciones lineales'),
(21, 'Segundo Parcial', 'parcial', 25.00, '2025-04-15', 'Trigonometría y funciones'),
(21, 'Examen Final', 'final', 35.00, '2025-05-10', 'Examen comprensivo del curso'),
(21, 'Tareas', 'tarea', 15.00, NULL, 'Promedio de tareas del semestre'),

-- Evaluaciones para Introducción a la Programación - Sección A (2025-1)
(27, 'Primer Parcial', 'parcial', 20.00, '2025-03-20', 'Fundamentos de programación'),
(27, 'Segundo Parcial', 'parcial', 20.00, '2025-04-20', 'Estructuras de control'),
(27, 'Proyecto Final', 'proyecto', 30.00, '2025-05-12', 'Desarrollo de aplicación completa'),
(27, 'Laboratorios', 'laboratorio', 20.00, NULL, 'Promedio de prácticas de laboratorio'),
(27, 'Quizzes', 'quiz', 10.00, NULL, 'Evaluaciones cortas semanales'),

-- Evaluaciones para POO - Sección A (2025-1)
(30, 'Primer Parcial', 'parcial', 25.00, '2025-03-18', 'Conceptos básicos de POO'),
(30, 'Segundo Parcial', 'parcial', 25.00, '2025-04-18', 'Herencia y polimorfismo'),
(30, 'Proyecto Final', 'proyecto', 35.00, '2025-05-08', 'Sistema completo orientado a objetos'),
(30, 'Tareas y Labs', 'laboratorio', 15.00, NULL, 'Ejercicios prácticos'),

-- Evaluaciones para Contabilidad I - Sección A (2025-1)
(49, 'Primer Parcial', 'parcial', 30.00, '2025-03-12', 'Fundamentos contables'),
(49, 'Segundo Parcial', 'parcial', 30.00, '2025-04-12', 'Estados financieros básicos'),
(49, 'Examen Final', 'final', 25.00, '2025-05-05', 'Evaluación integral'),
(49, 'Casos Prácticos', 'tarea', 15.00, NULL, 'Ejercicios de aplicación'),

-- Evaluaciones para Anatomía Humana I - Sección A (2025-1)
(57, 'Primer Parcial Teórico', 'parcial', 20.00, '2025-03-25', 'Sistema locomotor'),
(57, 'Segundo Parcial Teórico', 'parcial', 20.00, '2025-04-25', 'Sistemas orgánicos'),
(57, 'Prácticas de Laboratorio', 'laboratorio', 25.00, NULL, 'Identificación anatómica'),
(57, 'Examen Final', 'final', 25.00, '2025-05-15', 'Examen práctico y teórico'),
(57, 'Reportes', 'tarea', 10.00, NULL, 'Informes de prácticas'),

-- ====================================
-- NOTAS PARCIALES (CICLO 2025-1)
-- ====================================

-- Notas del Primer Parcial de Matemática I - Sección A
INSERT INTO notas (inscripcion_id, evaluacion_id, nota, fecha_calificacion, observaciones) VALUES
-- Obtener IDs de inscripciones para la sección 21 (Matemática I - Sección A)
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 91 AND seccion_id = 21), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 21 AND nombre = 'Primer Parcial'), 
    78.50, '2025-03-18', 'Buen desempeño en álgebra'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 93 AND seccion_id = 21), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 21 AND nombre = 'Primer Parcial'), 
    85.00, '2025-03-18', 'Excelente comprensión'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 95 AND seccion_id = 21), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 21 AND nombre = 'Primer Parcial'), 
    72.25, '2025-03-18', 'Necesita reforzar conceptos básicos'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 97 AND seccion_id = 21), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 21 AND nombre = 'Primer Parcial'), 
    91.75, '2025-03-18', 'Destacado'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 99 AND seccion_id = 21), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 21 AND nombre = 'Primer Parcial'), 
    68.00, '2025-03-18', 'Debe estudiar más'
),

-- Notas del Primer Parcial de Programación - Sección A
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 91 AND seccion_id = 27), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 27 AND nombre = 'Primer Parcial'), 
    88.50, '2025-03-23', 'Muy buena lógica de programación'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 95 AND seccion_id = 27), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 27 AND nombre = 'Primer Parcial'), 
    92.25, '2025-03-23', 'Excelente'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 97 AND seccion_id = 27), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 27 AND nombre = 'Primer Parcial'), 
    76.00, '2025-03-23', 'Regular, debe practicar más'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 41 AND seccion_id = 27), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 27 AND nombre = 'Primer Parcial'), 
    83.75, '2025-03-23', 'Buen progreso'
),

-- Notas de Laboratorios de Programación (promedio parcial)
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 91 AND seccion_id = 27), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 27 AND nombre = 'Laboratorios'), 
    85.00, '2025-04-01', 'Muy participativo en las prácticas'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 95 AND seccion_id = 27), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 27 AND nombre = 'Laboratorios'), 
    90.50, '2025-04-01', 'Excelente trabajo en equipo'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 97 AND seccion_id = 27), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 27 AND nombre = 'Laboratorios'), 
    78.25, '2025-04-01', 'Debe mejorar documentación'
),

-- Notas del Primer Parcial de POO
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 11 AND seccion_id = 30), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 30 AND nombre = 'Primer Parcial'), 
    89.00, '2025-03-21', 'Domina bien los conceptos'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 17 AND seccion_id = 30), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 30 AND nombre = 'Primer Parcial'), 
    94.50, '2025-03-21', 'Excelente comprensión de OOP'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 18 AND seccion_id = 30), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 30 AND nombre = 'Primer Parcial'), 
    82.75, '2025-03-21', 'Buen nivel'
),

-- Notas del Primer Parcial de Contabilidad
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 92 AND seccion_id = 49), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 49 AND nombre = 'Primer Parcial'), 
    87.25, '2025-03-15', 'Comprende bien los principios'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 100 AND seccion_id = 49), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 49 AND nombre = 'Primer Parcial'), 
    79.50, '2025-03-15', 'Necesita práctica en ejercicios'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 42 AND seccion_id = 49), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 49 AND nombre = 'Primer Parcial'), 
    91.00, '2025-03-15', 'Destacada'
);

-- ====================================
-- COMPLETAR INSCRIPCIONES CON MÁS ESTUDIANTES
-- ====================================

-- Más inscripciones para materias de semestres intermedios y avanzados
INSERT INTO inscripciones (estudiante_id, seccion_id, fecha_inscripcion, estado) VALUES
-- Base de Datos I - Sección A (2025-1) - Estudiantes de 5to semestre aprox
(21, 35, '2025-01-10', 'inscrito'), -- Ángel David
(25, 35, '2025-01-10', 'inscrito'), -- Maximiliano José  
(27, 35, '2025-01-10', 'inscrito'), -- Bruno Alejandro
(71, 35, '2025-01-10', 'inscrito'), -- Hugo Alejandro
(73, 35, '2025-01-10', 'inscrito'), -- Nelson Eduardo
(75, 35, '2025-01-10', 'inscrito'), -- Cristian Roberto
(77, 35, '2025-01-10', 'inscrito'), -- Giovanni Estuardo

-- Sistemas Operativos - Sección A (2025-1)
(1, 37, '2025-01-10', 'inscrito'), -- José María (semestre avanzado)
(3, 37, '2025-01-10', 'inscrito'), -- Carlos Eduardo
(7, 37, '2025-01-10', 'inscrito'), -- Roberto Carlos
(11, 37, '2025-01-10', 'inscrito'), -- Fernando José
(17, 37, '2025-01-10', 'inscrito'), -- Mateo Nicolás
(51, 37, '2025-01-10', 'inscrito'), -- Alexander José
(55, 37, '2025-01-10', 'inscrito'), -- Mauricio David

-- Ingeniería de Software - Sección A (2025-1) - Estudiantes avanzados
(1, 39, '2025-01-10', 'inscrito'), -- José María
(3, 39, '2025-01-10', 'inscrito'), -- Carlos Eduardo
(51, 39, '2025-01-10', 'inscrito'), -- Alexander José
(55, 39, '2025-01-10', 'inscrito'), -- Mauricio David
(59, 39, '2025-01-10', 'inscrito'), -- Enrique Gabriel
(61, 39, '2025-01-10', 'inscrito'), -- Kevin Rodrigo

-- Administración I - Sección A (2025-1)
(2, 50, '2025-01-10', 'inscrito'), -- Ana Sofía
(8, 50, '2025-01-10', 'inscrito'), -- Gabriela Isabel
(12, 50, '2025-01-10', 'inscrito'), -- Valentina María
(22, 50, '2025-01-10', 'inscrito'), -- Emilia Victoria
(32, 50, '2025-01-10', 'inscrito'), -- Ariana Beatriz
(54, 50, '2025-01-10', 'inscrito'), -- Carmen Lucía
(60, 50, '2025-01-10', 'inscrito'), -- Diana Sofía

-- Investigación de Operaciones I - Sección A (2025-1) - Ing. Industrial
(4, 44, '2025-01-10', 'inscrito'), -- María José
(9, 44, '2025-01-10', 'inscrito'), -- Diego Alejandro
(25, 44, '2025-01-10', 'inscrito'), -- Maximiliano José
(33, 44, '2025-01-10', 'inscrito'), -- Joaquín Sebastián
(52, 44, '2025-01-10', 'inscrito'), -- Paola Beatriz
(62, 44, '2025-01-10', 'inscrito'), -- Brenda Marisol
(69, 44, '2025-01-10', 'inscrito'), -- Rolando José

-- Anatomía Humana II - Sección A (2025-1) - Medicina 2do año
(6, 58, '2025-01-10', 'inscrito'), -- Andrea Paola
(14, 58, '2025-01-10', 'inscrito'), -- Isabella Sofía
(24, 58, '2025-01-10', 'inscrito'), -- Sofía Esperanza
(56, 58, '2025-01-10', 'inscrito'), -- Alejandra Nicole
(64, 58, '2025-01-10', 'inscrito'), -- Kimberly Paola
(68, 58, '2025-01-10', 'inscrito'), -- Mónica Esperanza
(74, 58, '2025-01-10', 'inscrito'), -- Andrea Gabriela

-- Técnicas de Estudio - Sección A (2025-1) - Materia de servicio
(91, 61, '2025-01-10', 'inscrito'), -- Anthony José
(92, 61, '2025-01-10', 'inscrito'), -- Ingrid Stephanie
(93, 61, '2025-01-10', 'inscrito'), -- Brandon Esteban
(94, 61, '2025-01-10', 'inscrito'), -- Sharon Nicole
(95, 61, '2025-01-10', 'inscrito'), -- Kevin Daniel
(96, 61, '2025-01-10', 'inscrito'), -- Ashley Paola
(97, 61, '2025-01-10', 'inscrito'), -- Bryan Eduardo
(98, 61, '2025-01-10', 'inscrito'), -- Allison María
(99, 61, '2025-01-10', 'inscrito'), -- Javier Emilio
(100, 61, '2025-01-10', 'inscrito'); -- Britany Sofía

-- ====================================
-- ACTUALIZAR DATOS CALCULADOS
-- ====================================

-- Actualizar promedios y créditos de estudiantes que completaron el ciclo 2024-2
UPDATE estudiantes 
SET 
    promedio_general = calcular_promedio_estudiante(id),
    creditos_aprobados = obtener_creditos_aprobados(id),
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT DISTINCT estudiante_id 
    FROM inscripciones 
    WHERE estado IN ('aprobado', 'reprobado')
);

-- ====================================
-- EVALUACIONES ADICIONALES PARA OTRAS SECCIONES
-- ====================================

-- Evaluaciones para Base de Datos I - Sección A (2025-1)
INSERT INTO evaluaciones (seccion_id, nombre, tipo, ponderacion, fecha_evaluacion, descripcion) VALUES
(35, 'Primer Parcial', 'parcial', 25.00, '2025-03-22', 'Modelo relacional y álgebra'),
(35, 'Segundo Parcial', 'parcial', 25.00, '2025-04-22', 'SQL y normalización'),
(35, 'Proyecto de BD', 'proyecto', 30.00, '2025-05-13', 'Diseño e implementación completa'),
(35, 'Laboratorios', 'laboratorio', 20.00, NULL, 'Prácticas de SQL y diseño'),

-- Evaluaciones para Sistemas Operativos - Sección A (2025-1)
(37, 'Primer Parcial', 'parcial', 30.00, '2025-03-19', 'Procesos y memoria'),
(37, 'Segundo Parcial', 'parcial', 30.00, '2025-04-19', 'Sistemas de archivos'),
(37, 'Examen Final', 'final', 25.00, '2025-05-14', 'Evaluación integral'),
(37, 'Prácticas', 'laboratorio', 15.00, NULL, 'Configuración y administración'),

-- Evaluaciones para Ingeniería de Software - Sección A (2025-1)
(39, 'Primer Parcial', 'parcial', 20.00, '2025-03-28', 'Metodologías ágiles'),
(39, 'Segundo Parcial', 'parcial', 20.00, '2025-04-28', 'Análisis y diseño'),
(39, 'Proyecto Final', 'proyecto', 40.00, '2025-05-16', 'Desarrollo de sistema completo'),
(39, 'Documentación', 'tarea', 20.00, NULL, 'Documentos de ingeniería'),

-- Evaluaciones para Administración I - Sección A (2025-1)
(50, 'Primer Parcial', 'parcial', 30.00, '2025-03-14', 'Teorías administrativas'),
(50, 'Segundo Parcial', 'parcial', 30.00, '2025-04-14', 'Planeación y organización'),
(50, 'Examen Final', 'final', 25.00, '2025-05-07', 'Casos empresariales'),
(50, 'Ensayos', 'tarea', 15.00, NULL, 'Análisis de casos'),

-- Evaluaciones para Investigación de Operaciones I - Sección A (2025-1)
(44, 'Primer Parcial', 'parcial', 25.00, '2025-03-17', 'Programación lineal'),
(44, 'Segundo Parcial', 'parcial', 25.00, '2025-04-17', 'Método simplex'),
(44, 'Proyecto Final', 'proyecto', 35.00, '2025-05-11', 'Optimización empresarial'),
(44, 'Tareas', 'tarea', 15.00, NULL, 'Ejercicios semanales'),

-- Evaluaciones para Técnicas de Estudio - Sección A (2025-1)
(61, 'Evaluación Continua', 'tarea', 60.00, NULL, 'Participación y ejercicios'),
(61, 'Proyecto Personal', 'proyecto', 40.00, '2025-05-09', 'Plan de estudio personalizado');

-- ====================================
-- MÁS NOTAS PARCIALES PARA DIVERSAS MATERIAS
-- ====================================

-- Notas del Primer Parcial de Base de Datos I - Sección A
INSERT INTO notas (inscripcion_id, evaluacion_id, nota, fecha_calificacion, observaciones) VALUES
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 21 AND seccion_id = 35), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 35 AND nombre = 'Primer Parcial'), 
    86.50, '2025-03-25', 'Excelente comprensión del modelo relacional'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 25 AND seccion_id = 35), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 35 AND nombre = 'Primer Parcial'), 
    79.25, '2025-03-25', 'Buen manejo de álgebra relacional'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 27 AND seccion_id = 35), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 35 AND nombre = 'Primer Parcial'), 
    92.00, '2025-03-25', 'Destacado en conceptos teóricos'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 71 AND seccion_id = 35), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 35 AND nombre = 'Primer Parcial'), 
    74.75, '2025-03-25', 'Debe reforzar normalización'
),

-- Notas del Primer Parcial de Sistemas Operativos
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 1 AND seccion_id = 37), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 37 AND nombre = 'Primer Parcial'), 
    88.75, '2025-03-22', 'Muy buen entendimiento de procesos'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 3 AND seccion_id = 37), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 37 AND nombre = 'Primer Parcial'), 
    91.50, '2025-03-22', 'Excelente conocimiento teórico'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 7 AND seccion_id = 37), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 37 AND nombre = 'Primer Parcial'), 
    83.25, '2025-03-22', 'Buen nivel general'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 11 AND seccion_id = 37), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 37 AND nombre = 'Primer Parcial'), 
    95.00, '2025-03-22', 'Sobresaliente'
),

-- Notas del Primer Parcial de Administración I
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 2 AND seccion_id = 50), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 50 AND nombre = 'Primer Parcial'), 
    84.00, '2025-03-17', 'Domina las teorías clásicas'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 8 AND seccion_id = 50), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 50 AND nombre = 'Primer Parcial'), 
    77.50, '2025-03-17', 'Necesita profundizar conceptos'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 12 AND seccion_id = 50), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 50 AND nombre = 'Primer Parcial'), 
    89.25, '2025-03-17', 'Excelente análisis crítico'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 22 AND seccion_id = 50), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 50 AND nombre = 'Primer Parcial'), 
    92.75, '2025-03-17', 'Destacada participación'
),

-- Notas del Primer Parcial de Investigación de Operaciones I
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 4 AND seccion_id = 44), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 44 AND nombre = 'Primer Parcial'), 
    87.00, '2025-03-20', 'Muy buena en optimización'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 9 AND seccion_id = 44), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 44 AND nombre = 'Primer Parcial'), 
    81.75, '2025-03-20', 'Buen manejo matemático'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 25 AND seccion_id = 44), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 44 AND nombre = 'Primer Parcial'), 
    93.50, '2025-03-20', 'Excelente razonamiento lógico'
),

-- Notas de Evaluación Continua de Técnicas de Estudio
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 91 AND seccion_id = 61), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 61 AND nombre = 'Evaluación Continua'), 
    88.00, '2025-04-05', 'Muy participativo y organizado'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 92 AND seccion_id = 61), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 61 AND nombre = 'Evaluación Continua'), 
    85.50, '2025-04-05', 'Buenas técnicas aplicadas'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 93 AND seccion_id = 61), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 61 AND nombre = 'Evaluación Continua'), 
    91.25, '2025-04-05', 'Excelente mejora en hábitos'
),
(
    (SELECT id FROM inscripciones WHERE estudiante_id = 94 AND seccion_id = 61), 
    (SELECT id FROM evaluaciones WHERE seccion_id = 61 AND nombre = 'Evaluación Continua'), 
    79.75, '2025-04-05', 'Debe ser más constante'
);

-- ====================================
-- HORARIOS DE PROFESORES Y DISPONIBILIDAD
-- ====================================

-- Tabla para horarios de profesores (opcional para reportes avanzados)
CREATE TABLE IF NOT EXISTS horarios_profesores (
    id SERIAL PRIMARY KEY,
    profesor_id INTEGER NOT NULL REFERENCES profesores(id),
    dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos horarios de ejemplo
INSERT INTO horarios_profesores (profesor_id, dia_semana, hora_inicio, hora_fin, disponible) VALUES
-- Profesor Carlos García (ID 1) - CC
(1, 1, '07:00', '12:00', true), -- Lunes mañana
(1, 1, '13:00', '19:00', true), -- Lunes tarde
(1, 3, '07:00', '12:00', true), -- Miércoles mañana
(1, 3, '13:00', '19:00', true), -- Miércoles tarde
(1, 5, '13:00', '19:00', true), -- Viernes tarde

-- Profesora María Rodríguez (ID 2) - BD
(2, 1, '16:00', '22:00', true), -- Lunes tarde-noche
(2, 2, '13:00', '19:00', true), -- Martes tarde
(2, 4, '16:00', '22:00', true), -- Jueves tarde-noche
(2, 5, '17:00', '21:00', true), -- Viernes tarde

-- Profesor Luis Morales (ID 3) - IA
(3, 2, '07:00', '15:00', true), -- Martes completo
(3, 4, '07:00', '15:00', true), -- Jueves completo
(3, 6, '08:00', '12:00', true); -- Sábado mañana

-- ====================================
-- TABLA DE HISTORIAL ACADÉMICO
-- ====================================

-- Vista mejorada para historial académico completo
CREATE OR REPLACE VIEW vista_historial_academico AS
SELECT 
    e.carnet,
    e.nombres || ' ' || e.apellidos AS estudiante,
    c.nombre AS carrera,
    f.nombre AS facultad,
    m.codigo AS codigo_materia,
    m.nombre AS materia,
    m.creditos,
    s.ciclo,
    s.codigo_seccion,
    p.nombres || ' ' || p.apellidos AS profesor,
    i.fecha_inscripcion,
    i.nota_final,
    i.estado,
    CASE 
        WHEN i.nota_final >= 61 THEN 'Aprobado'
        WHEN i.nota_final < 61 AND i.nota_final IS NOT NULL THEN 'Reprobado'
        WHEN i.estado = 'retirado' THEN 'Retirado'
        ELSE 'En Curso'
    END AS resultado,
    pe.semestre AS semestre_pensum,
    pe.obligatoria
FROM estudiantes e
INNER JOIN inscripciones_carrera ic ON e.id = ic.estudiante_id AND ic.activa = true
INNER JOIN carreras c ON ic.carrera_id = c.id
INNER JOIN facultades f ON c.facultad_id = f.id
INNER JOIN inscripciones i ON e.id = i.estudiante_id
INNER JOIN secciones s ON i.seccion_id = s.id
INNER JOIN materias m ON s.materia_id = m.id
INNER JOIN profesores p ON s.profesor_id = p.id
LEFT JOIN pensum pe ON c.id = pe.carrera_id AND m.id = pe.materia_id
ORDER BY e.carnet, s.ciclo, m.nombre;

-- ====================================
-- VISTA PARA RENDIMIENTO POR FACULTAD
-- ====================================

CREATE OR REPLACE VIEW vista_rendimiento_facultad AS
SELECT 
    f.nombre AS facultad,
    COUNT(DISTINCT e.id) AS total_estudiantes,
    COUNT(DISTINCT CASE WHEN i.estado = 'aprobado' THEN i.id END) AS inscripciones_aprobadas,
    COUNT(DISTINCT CASE WHEN i.estado = 'reprobado' THEN i.id END) AS inscripciones_reprobadas,
    ROUND(
        (COUNT(CASE WHEN i.estado = 'aprobado' THEN 1 END) * 100.0 / 
         NULLIF(COUNT(CASE WHEN i.estado IN ('aprobado', 'reprobado') THEN 1 END), 0)), 2
    ) AS porcentaje_aprobacion,
    ROUND(AVG(CASE WHEN i.estado = 'aprobado' THEN i.nota_final END), 2) AS promedio_notas_aprobadas,
    ROUND(AVG(e.promedio_general), 2) AS promedio_general_estudiantes
FROM facultades f
INNER JOIN carreras c ON f.id = c.facultad_id
INNER JOIN inscripciones_carrera ic ON c.id = ic.carrera_id AND ic.activa = true
INNER JOIN estudiantes e ON ic.estudiante_id = e.id
LEFT JOIN inscripciones i ON e.id = i.estudiante_id
GROUP BY f.id, f.nombre
ORDER BY porcentaje_aprobacion DESC;

-- ====================================
-- VISTA PARA CARGA ACADÉMICA DE PROFESORES
-- ====================================

CREATE OR REPLACE VIEW vista_carga_profesores AS
SELECT 
    p.codigo_empleado,
    p.nombres || ' ' || p.apellidos AS profesor,
    p.especialidad,
    da.nombre AS departamento,
    COUNT(s.id) AS secciones_actuales,
    SUM(s.inscritos) AS total_estudiantes,
    SUM(m.creditos * s.inscritos) AS creditos_por_estudiante,
    STRING_AGG(DISTINCT s.horario, '; ') AS horarios,
    ROUND(AVG(pd.porcentaje_tiempo), 2) AS porcentaje_tiempo_promedio
FROM profesores p
LEFT JOIN profesor_departamento pd ON p.id = pd.profesor_id AND pd.activa = true
LEFT JOIN departamentos_academicos da ON pd.departamento_id = da.id
LEFT JOIN secciones s ON p.id = s.profesor_id AND s.activa = true AND s.ciclo = '2025-1'
LEFT JOIN materias m ON s.materia_id = m.id
WHERE p.activo = true
GROUP BY p.id, p.codigo_empleado, p.nombres, p.apellidos, p.especialidad, da.nombre
ORDER BY total_estudiantes DESC;

-- ====================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ====================================

-- Procedimiento para inscribir estudiante en sección
CREATE OR REPLACE FUNCTION inscribir_estudiante(
    p_estudiante_id INTEGER,
    p_seccion_id INTEGER
) RETURNS TEXT AS $
DECLARE
    v_cupo_disponible BOOLEAN;
    v_ya_inscrito BOOLEAN;
    v_materia_nombre VARCHAR(200);
    v_codigo_seccion VARCHAR(10);
BEGIN
    -- Verificar si ya está inscrito
    SELECT EXISTS(
        SELECT 1 FROM inscripciones 
        WHERE estudiante_id = p_estudiante_id 
        AND seccion_id = p_seccion_id
    ) INTO v_ya_inscrito;
    
    IF v_ya_inscrito THEN
        RETURN 'ERROR: El estudiante ya está inscrito en esta sección';
    END IF;
    
    -- Verificar cupo
    SELECT verificar_cupo_seccion(p_seccion_id) INTO v_cupo_disponible;
    
    IF NOT v_cupo_disponible THEN
        RETURN 'ERROR: No hay cupo disponible en esta sección';
    END IF;
    
    -- Obtener información de la sección para el mensaje
    SELECT m.nombre, s.codigo_seccion
    INTO v_materia_nombre, v_codigo_seccion
    FROM secciones s
    INNER JOIN materias m ON s.materia_id = m.id
    WHERE s.id = p_seccion_id;
    
    -- Realizar la inscripción
    INSERT INTO inscripciones (estudiante_id, seccion_id, fecha_inscripcion, estado)
    VALUES (p_estudiante_id, p_seccion_id, CURRENT_DATE, 'inscrito');
    
    RETURN 'ÉXITO: Estudiante inscrito en ' || v_materia_nombre || ' sección ' || v_codigo_seccion;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
END;
$ LANGUAGE plpgsql;

-- Función para obtener estudiantes por encima de cierto promedio
CREATE OR REPLACE FUNCTION estudiantes_promedio_alto(p_promedio_minimo DECIMAL DEFAULT 85.00)
RETURNS TABLE (
    carnet VARCHAR(20),
    nombre_completo TEXT,
    carrera TEXT,
    promedio_general DECIMAL(4,2),
    creditos_aprobados INTEGER
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        e.carnet,
        e.nombres || ' ' || e.apellidos,
        c.nombre,
        e.promedio_general,
        e.creditos_aprobados
    FROM estudiantes e
    LEFT JOIN inscripciones_carrera ic ON e.id = ic.estudiante_id AND ic.activa = true
    LEFT JOIN carreras c ON ic.carrera_id = c.id
    WHERE e.promedio_general >= p_promedio_minimo
    AND e.estado = 'activo'
    ORDER BY e.promedio_general DESC;
END;
$ LANGUAGE plpgsql;

-- ====================================
-- DATOS ESTADÍSTICOS FINALES
-- ====================================

-- Insertar algunas inscripciones adicionales para tener más datos
INSERT INTO inscripciones (estudiante_id, seccion_id, fecha_inscripcion, nota_final, estado) VALUES
-- Completar inscripciones del ciclo 2024-2 con más estudiantes
(5, 3, '2024-07-10', 83.75, 'aprobado'),   -- Luis Fernando - Mat II
(10, 4, '2024-07-10', 77.25, 'aprobado'),  -- Stephanie - Mat III
(15, 5, '2024-07-10', 89.50, 'aprobado'),  -- Sebastián - Física I
(19, 6, '2024-07-10', 84.00, 'aprobado'),  -- Santiago - Física II
(13, 10, '2024-07-10', 92.25, 'aprobado'), -- Alejandro - Estructura Datos
(23, 11, '2024-07-10', 76.75, 'aprobado'), -- Leonardo - BD I
(29, 12, '2024-07-10', 88.50, 'aprobado'), -- Adrián - BD II
(33, 15, '2024-07-10', 85.25, 'aprobado'), -- Joaquín - IO I
(35, 16, '2024-07-10', 91.00, 'aprobado'), -- Ricardo - IO II
(9, 17, '2024-07-10', 79.75, 'aprobado'),  -- Diego - Control Calidad
(26, 19, '2024-07-10', 94.50, 'aprobado'), -- Regina - Anatomía II
(28, 20, '2024-07-10', 87.25, 'aprobado'); -- Daniela - Fisiología

-- ====================================
-- COMENTARIOS FINALES Y VALIDACIONES
-- ====================================

-- Verificar integridad de datos
DO $
DECLARE
    total_estudiantes INTEGER;
    total_inscripciones INTEGER;
    total_secciones INTEGER;
    total_profesores INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_estudiantes FROM estudiantes WHERE estado = 'activo';
    SELECT COUNT(*) INTO total_inscripciones FROM inscripciones;
    SELECT COUNT(*) INTO total_secciones FROM secciones WHERE activa = true;
    SELECT COUNT(*) INTO total_profesores FROM profesores WHERE activo = true;
    
    RAISE NOTICE 'ESTADÍSTICAS FINALES:';
    RAISE NOTICE 'Estudiantes activos: %', total_estudiantes;
    RAISE NOTICE 'Total inscripciones: %', total_inscripciones;
    RAISE NOTICE 'Secciones activas: %', total_secciones;
    RAISE NOTICE 'Profesores activos: %', total_profesores;
END $;

-- Mensaje de finalización
SELECT 'Base de datos del Sistema Universitario creada exitosamente con más de 1000 registros distribuidos en 20 tablas principales.' as mensaje;