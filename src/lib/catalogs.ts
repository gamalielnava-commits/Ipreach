// Catalogos editables de Ipreach. En la fase 2 estos datos se migran a Supabase
// para poder editarlos sin tocar el codigo.

export interface Framework {
  slug: string;
  name: string;
  family: string;
  soteriology: string;
  pneumatology: string;
  eschatology: string;
  preachingEmphasis: string;
  summary: string;
}

export interface CatalogItem {
  slug: string;
  name: string;
  description: string;
}

export interface Method extends CatalogItem {
  author?: string;
  steps: string[];
}

export interface Strategy extends CatalogItem {
  author?: string;
}

export interface Theme {
  slug: string;
  name: string;
  category: string;
}

export interface Commentator {
  slug: string;
  name: string;
  group: string;
  note: string;
}

export interface SlideStyle {
  slug: string;
  name: string;
  promptBase: string;
  example: string;
}

// ---------------------------------------------------------------------------
// 1. MARCOS DOCTRINALES
// ---------------------------------------------------------------------------

export const frameworks: Framework[] = [
  {
    slug: "reformada",
    name: "Reformada / Presbiteriana",
    family: "Reformada",
    soteriology: "Calvinista (doctrinas de la gracia, TULIP)",
    pneumatology: "Cesacionista o continuista moderado",
    eschatology: "Amilenial o posmilenial; teologia del pacto",
    preachingEmphasis: "Predicacion expositiva y cristocentrica",
    summary:
      "Tradicion reformada centrada en la soberania de Dios, la gracia y la Confesion de Westminster.",
  },
  {
    slug: "bautista",
    name: "Bautista",
    family: "Bautista",
    soteriology: "Salvacion por gracia; calvinista o arminiana moderada",
    pneumatology: "Generalmente cesacionista",
    eschatology: "Premilenial comun; variada",
    preachingEmphasis: "Predicacion expositiva, autoridad de la Biblia",
    summary:
      "Enfatiza la autonomia de la iglesia local, el bautismo del creyente y la autoridad de las Escrituras.",
  },
  {
    slug: "asambleas-de-dios",
    name: "Asambleas de Dios",
    family: "Pentecostal clasica",
    soteriology: "Arminiana",
    pneumatology: "Continuista; bautismo del Espiritu con lenguas",
    eschatology: "Premilenial, esperanza bienaventurada",
    preachingEmphasis: "Predicacion biblica con enfasis en el Espiritu",
    summary:
      "Pentecostal clasica fundada en las 16 Verdades Fundamentales y el bautismo en el Espiritu Santo.",
  },
  {
    slug: "iglesia-de-dios",
    name: "Iglesia de Dios (Cleveland)",
    family: "Pentecostal clasica",
    soteriology: "Arminiana, con santificacion definida",
    pneumatology: "Continuista; dones del Espiritu",
    eschatology: "Premilenial",
    preachingEmphasis: "Predicacion de santidad y poder del Espiritu",
    summary:
      "Pentecostal de santidad con enfasis en la santificacion, los dones y la sanidad divina.",
  },
  {
    slug: "pentecostal-unida",
    name: "Pentecostal Unida (Unicitaria)",
    family: "Pentecostal clasica",
    soteriology: "Arminiana; nuevo nacimiento con agua y Espiritu",
    pneumatology: "Continuista; lenguas como evidencia",
    eschatology: "Premilenial",
    preachingEmphasis: "Predicacion de la unicidad y la santidad practica",
    summary:
      "Movimiento unicitario (no trinitario): un solo Dios y bautismo en el nombre de Jesus.",
  },
  {
    slug: "cuadrangular",
    name: "Iglesia Cuadrangular (Foursquare)",
    family: "Pentecostal clasica",
    soteriology: "Arminiana",
    pneumatology: "Continuista",
    eschatology: "Premilenial",
    preachingEmphasis: "Cristo Salvador, Bautizador, Sanador y Rey",
    summary:
      "Pentecostal fundada por Aimee Semple McPherson; el evangelio cuadrangular de Cristo.",
  },
  {
    slug: "metodista-wesleyana",
    name: "Metodista / Wesleyana",
    family: "Wesleyana / Santidad",
    soteriology: "Arminiana; gracia preveniente",
    pneumatology: "Enfasis en santificacion mas que en dones",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion de la gracia y la santidad de vida",
    summary:
      "Tradicion wesleyana centrada en la gracia para todos y la santificacion entera.",
  },
  {
    slug: "nazareno",
    name: "Iglesia del Nazareno",
    family: "Wesleyana / Santidad",
    soteriology: "Arminiana wesleyana",
    pneumatology: "Santificacion como segunda obra de gracia",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion de santidad y amor perfecto",
    summary:
      "Movimiento de santidad: la entera santificacion como segunda obra de gracia.",
  },
  {
    slug: "adventista",
    name: "Adventista del Septimo Dia",
    family: "Otras",
    soteriology: "Arminiana",
    pneumatology: "Continuista; don de profecia",
    eschatology: "Premilenial; santuario y juicio investigador",
    preachingEmphasis: "Predicacion profetica y de la esperanza adventista",
    summary:
      "Guarda el sabado y enfatiza la segunda venida, el santuario celestial y la salud.",
  },
  {
    slug: "luterana",
    name: "Luterana",
    family: "Otras",
    soteriology: "Justificacion solo por la fe",
    pneumatology: "Cesacionista; medios de gracia",
    eschatology: "Amilenial",
    preachingEmphasis: "Predicacion de Ley y Evangelio",
    summary:
      "Tradicion de la Reforma centrada en la justificacion por la fe y los medios de gracia.",
  },
  {
    slug: "hermanos-libres",
    name: "Hermanos Libres",
    family: "Otras",
    soteriology: "Salvacion por gracia; seguridad eterna",
    pneumatology: "Generalmente cesacionista",
    eschatology: "Dispensacional; arrebatamiento pretribulacional",
    preachingEmphasis: "Exposicion sencilla, sacerdocio universal",
    summary:
      "Reunion sencilla sin clero, mesa del Senor semanal y lectura dispensacional.",
  },
  {
    slug: "carismatico-no-denominacional",
    name: "Carismatico no denominacional",
    family: "Carismatica / No denominacional",
    soteriology: "Variada, evangelica",
    pneumatology: "Continuista; dones para hoy",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion practica con adoracion como encuentro",
    summary:
      "Iglesias independientes carismaticas, adoracion contemporanea y libertad en el Espiritu.",
  },
  {
    slug: "neopentecostal",
    name: "Neopentecostal",
    family: "Carismatica / No denominacional",
    soteriology: "Arminiana evangelica",
    pneumatology: "Continuista",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion de avivamiento y crecimiento",
    summary:
      "Megaiglesias con enfasis en la experiencia, el avivamiento y la adoracion contemporanea.",
  },
  {
    slug: "palabra-de-fe",
    name: "Palabra de Fe",
    family: "Carismatica / No denominacional",
    soteriology: "Arminiana evangelica",
    pneumatology: "Continuista",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion de fe, confesion positiva y prosperidad",
    summary:
      "Movimiento de la fe: confesion positiva, prosperidad integral y autoridad del creyente.",
  },
  {
    slug: "apostolico-redes",
    name: "Apostolico / Redes apostolicas",
    family: "Carismatica / No denominacional",
    soteriology: "Arminiana evangelica",
    pneumatology: "Continuista; ministerio quintuple",
    eschatology: "Variada, a menudo del Reino",
    preachingEmphasis: "Predicacion de gobierno apostolico y discipulado",
    summary:
      "Redes con apostoles y profetas hoy, cobertura espiritual y enfasis en el discipulado.",
  },
  {
    slug: "tercera-ola-vineyard",
    name: "Tercera Ola / Vineyard",
    family: "Carismatica / No denominacional",
    soteriology: "Evangelica",
    pneumatology: "Continuista; senales del Reino",
    eschatology: "Reino 'ya pero todavia no'",
    preachingEmphasis: "Predicacion del Reino con ministracion del Espiritu",
    summary:
      "Movimiento de poder del Reino, sanidad y senales, en la linea de John Wimber.",
  },
  {
    slug: "cultura-avivamiento",
    name: "Cultura de avivamiento",
    family: "Carismatica / No denominacional",
    soteriology: "Evangelica",
    pneumatology: "Continuista; enfasis en lo sobrenatural",
    eschatology: "Optimista, del Reino",
    preachingEmphasis: "Predicacion de identidad, gloria y sanidad",
    summary:
      "Cultura de avivamiento con enfasis en la identidad de hijos, la sanidad y lo profetico.",
  },
  {
    slug: "g12-celular",
    name: "G12 / Modelo celular",
    family: "Carismatica / No denominacional",
    soteriology: "Arminiana evangelica",
    pneumatology: "Continuista",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion de vision celular y discipulado",
    summary:
      "Modelo de discipulado por celulas y la conquista de los doce (vision G12).",
  },
  {
    slug: "profetico",
    name: "Iglesias profeticas",
    family: "Carismatica / No denominacional",
    soteriology: "Evangelica",
    pneumatology: "Continuista; enfasis profetico",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion profetica y de guerra espiritual",
    summary:
      "Enfasis en la palabra profetica, el discernimiento y la guerra espiritual.",
  },
  {
    slug: "reino-dominionista",
    name: "Movimiento del Reino",
    family: "Carismatica / No denominacional",
    soteriology: "Evangelica",
    pneumatology: "Continuista",
    eschatology: "Del Reino, transformacionista",
    preachingEmphasis: "Predicacion de transformacion social y del Reino",
    summary:
      "Enfasis en la transformacion de la sociedad y la influencia en las esferas culturales.",
  },
  {
    slug: "independiente-comunitaria",
    name: "Independiente / Comunitaria",
    family: "Carismatica / No denominacional",
    soteriology: "Evangelica eclectica",
    pneumatology: "Variada",
    eschatology: "Variada",
    preachingEmphasis: "Predicacion biblica practica y accesible",
    summary:
      "Iglesias comunitarias sin afiliacion, doctrina evangelica central y enfoque practico.",
  },
];

// ---------------------------------------------------------------------------
// 2. TEMAS DOCTRINALES POR DENOMINACION
// ---------------------------------------------------------------------------

export const doctrinalThemes: Record<string, string[]> = {
  reformada: [
    "Las doctrinas de la gracia (TULIP)",
    "La soberania de Dios en la salvacion",
    "La teologia del pacto",
    "La perseverancia de los santos",
    "Las cinco solas de la Reforma",
    "Ley y Evangelio",
  ],
  bautista: [
    "La salvacion por gracia mediante la fe",
    "El bautismo del creyente por inmersion",
    "La autonomia de la iglesia local",
    "El sacerdocio de todos los creyentes",
    "La seguridad eterna del creyente",
    "La autoridad e inerrancia de las Escrituras",
  ],
  "asambleas-de-dios": [
    "El bautismo en el Espiritu Santo con evidencia de lenguas",
    "Las 16 Verdades Fundamentales",
    "La sanidad divina en la expiacion",
    "La santificacion progresiva",
    "La esperanza bienaventurada (el arrebatamiento)",
    "El reino milenial de Cristo",
  ],
  "iglesia-de-dios": [
    "La santificacion como obra definida",
    "El bautismo del Espiritu Santo",
    "Los dones del Espiritu en la iglesia",
    "La sanidad divina",
    "El lavamiento de pies como ordenanza",
  ],
  "pentecostal-unida": [
    "La unicidad de Dios",
    "El bautismo en agua en el nombre de Jesus",
    "El nuevo nacimiento (agua y Espiritu)",
    "La santidad practica y la vida apartada",
  ],
  cuadrangular: [
    "Jesucristo el Salvador",
    "Jesucristo el Bautizador con el Espiritu Santo",
    "Jesucristo el Sanador",
    "Jesucristo el Rey que viene",
  ],
  "metodista-wesleyana": [
    "La gracia preveniente",
    "La santificacion entera y la perfeccion cristiana",
    "El testimonio interior del Espiritu",
    "La gracia ofrecida a todos",
  ],
  nazareno: [
    "La entera santificacion como segunda obra de gracia",
    "La vida de santidad",
    "El amor perfecto",
    "La gracia que restaura",
  ],
  adventista: [
    "El sabado como dia de reposo",
    "El santuario celestial y el juicio investigador",
    "El estado de los muertos",
    "El don de profecia",
    "La salud y el cuerpo como templo",
    "La segunda venida de Cristo",
  ],
  luterana: [
    "La justificacion solo por la fe",
    "La distincion entre Ley y Evangelio",
    "Los sacramentos como medios de gracia",
    "La sola Escritura",
  ],
  "hermanos-libres": [
    "La mesa del Senor cada domingo",
    "El sacerdocio universal sin clero",
    "La lectura dispensacional de la Biblia",
    "El arrebatamiento de la iglesia",
  ],
  "carismatico-no-denominacional": [
    "Los dones del Espiritu para hoy",
    "La adoracion como encuentro con Dios",
    "La libertad y guianza del Espiritu",
  ],
  neopentecostal: [
    "El avivamiento y el mover del Espiritu",
    "El crecimiento de la iglesia",
    "El poder del Espiritu para la vida diaria",
  ],
  "palabra-de-fe": [
    "La confesion positiva",
    "La fe como fuerza que recibe las promesas",
    "La prosperidad integral",
    "La autoridad del creyente",
  ],
  "apostolico-redes": [
    "El ministerio quintuple (apostoles y profetas hoy)",
    "La cobertura y el gobierno apostolico",
    "El discipulado y la paternidad espiritual",
  ],
  "tercera-ola-vineyard": [
    "El Reino de Dios 'ya pero todavia no'",
    "Sanidad y senales del Reino",
    "La ministracion sencilla del Espiritu",
  ],
  "cultura-avivamiento": [
    "La identidad como hijos de Dios",
    "La sanidad sobrenatural",
    "Lo profetico y la gloria de Dios",
  ],
  "g12-celular": [
    "La vision celular",
    "El discipulado uno a uno",
    "La conquista de los doce",
  ],
  profetico: [
    "La palabra profetica para la iglesia",
    "La guerra espiritual",
    "El discernimiento de tiempos y temporadas",
  ],
  "reino-dominionista": [
    "La transformacion de la sociedad",
    "La influencia en las esferas de la cultura",
    "El Reino manifestado aqui y ahora",
  ],
  "independiente-comunitaria": [
    "El evangelio centrado en Cristo",
    "La fe practica para la vida diaria",
  ],
};

// ---------------------------------------------------------------------------
// 3. INDICE TEMATICO GENERAL
// ---------------------------------------------------------------------------

export const themes: Theme[] = [
  { slug: "fe", name: "Fe", category: "Vida espiritual" },
  { slug: "oracion", name: "Oracion", category: "Vida espiritual" },
  { slug: "ayuno", name: "Ayuno", category: "Vida espiritual" },
  { slug: "adoracion", name: "Adoracion", category: "Vida espiritual" },
  { slug: "alabanza", name: "Alabanza", category: "Vida espiritual" },
  { slug: "santidad", name: "Santidad", category: "Vida espiritual" },
  { slug: "arrepentimiento", name: "Arrepentimiento", category: "Vida espiritual" },
  { slug: "perdon", name: "Perdon", category: "Vida espiritual" },
  { slug: "gracia", name: "Gracia", category: "Vida espiritual" },
  { slug: "salvacion", name: "Salvacion", category: "Vida espiritual" },
  { slug: "justificacion", name: "Justificacion", category: "Vida espiritual" },
  { slug: "santificacion", name: "Santificacion", category: "Vida espiritual" },
  { slug: "obediencia", name: "Obediencia", category: "Vida espiritual" },
  { slug: "humildad", name: "Humildad", category: "Vida espiritual" },
  { slug: "identidad-en-cristo", name: "Identidad en Cristo", category: "Vida espiritual" },
  { slug: "llamado-y-proposito", name: "Llamado y proposito", category: "Vida espiritual" },
  { slug: "madurez-espiritual", name: "Madurez espiritual", category: "Vida espiritual" },
  { slug: "vida-devocional", name: "Vida devocional", category: "Vida espiritual" },
  { slug: "bautismo-del-espiritu", name: "Bautismo del Espiritu Santo", category: "Espiritu Santo" },
  { slug: "dones-espirituales", name: "Dones espirituales", category: "Espiritu Santo" },
  { slug: "llenura-del-espiritu", name: "Llenura del Espiritu", category: "Espiritu Santo" },
  { slug: "fruto-del-espiritu", name: "Fruto del Espiritu", category: "Espiritu Santo" },
  { slug: "la-trinidad", name: "La Trinidad", category: "Doctrina" },
  { slug: "la-cruz", name: "La cruz", category: "Doctrina" },
  { slug: "la-resurreccion", name: "La resurreccion", category: "Doctrina" },
  { slug: "segunda-venida", name: "La segunda venida", category: "Doctrina" },
  { slug: "cielo-e-infierno", name: "El cielo y el infierno", category: "Doctrina" },
  { slug: "autoridad-de-la-biblia", name: "Autoridad de la Biblia", category: "Doctrina" },
  { slug: "la-iglesia", name: "La iglesia", category: "Doctrina" },
  { slug: "soberania-de-dios", name: "La soberania de Dios", category: "Doctrina" },
  { slug: "caracter-de-dios", name: "El caracter de Dios", category: "Doctrina" },
  { slug: "reino-de-dios", name: "El Reino de Dios", category: "Doctrina" },
  { slug: "matrimonio", name: "Matrimonio", category: "Familia y relaciones" },
  { slug: "familia", name: "Familia", category: "Familia y relaciones" },
  { slug: "crianza", name: "Crianza de los hijos", category: "Familia y relaciones" },
  { slug: "noviazgo", name: "Noviazgo", category: "Familia y relaciones" },
  { slug: "solteros", name: "Solteros", category: "Familia y relaciones" },
  { slug: "amistad", name: "Amistad y relaciones", category: "Familia y relaciones" },
  { slug: "reconciliacion", name: "Reconciliacion", category: "Familia y relaciones" },
  { slug: "bendicion-economica", name: "Bendicion economica y finanzas", category: "Provision y mayordomia" },
  { slug: "diezmos-y-ofrendas", name: "Diezmos y ofrendas", category: "Provision y mayordomia" },
  { slug: "mayordomia", name: "Mayordomia", category: "Provision y mayordomia" },
  { slug: "trabajo-y-vocacion", name: "Trabajo y vocacion", category: "Provision y mayordomia" },
  { slug: "provision-de-dios", name: "La provision de Dios", category: "Provision y mayordomia" },
  { slug: "generosidad", name: "Generosidad", category: "Provision y mayordomia" },
  { slug: "sufrimiento", name: "Sufrimiento", category: "Pruebas y batallas" },
  { slug: "pruebas", name: "Pruebas", category: "Pruebas y batallas" },
  { slug: "sanidad-divina", name: "Sanidad divina", category: "Pruebas y batallas" },
  { slug: "liberacion", name: "Liberacion", category: "Pruebas y batallas" },
  { slug: "guerra-espiritual", name: "Guerra espiritual", category: "Pruebas y batallas" },
  { slug: "ansiedad-y-depresion", name: "Ansiedad y depresion", category: "Pruebas y batallas" },
  { slug: "temor", name: "Temor", category: "Pruebas y batallas" },
  { slug: "duelo-y-perdida", name: "Duelo y perdida", category: "Pruebas y batallas" },
  { slug: "perseverancia", name: "Perseverancia", category: "Pruebas y batallas" },
  { slug: "evangelismo", name: "Evangelismo", category: "Mision y servicio" },
  { slug: "misiones", name: "Misiones", category: "Mision y servicio" },
  { slug: "discipulado", name: "Discipulado", category: "Mision y servicio" },
  { slug: "liderazgo", name: "Liderazgo", category: "Mision y servicio" },
  { slug: "servicio", name: "Servicio", category: "Mision y servicio" },
  { slug: "gran-comision", name: "La Gran Comision", category: "Mision y servicio" },
  { slug: "justicia-social", name: "Compasion y justicia social", category: "Mision y servicio" },
  { slug: "unidad-de-la-iglesia", name: "Unidad de la iglesia", category: "Mision y servicio" },
  { slug: "falsas-ensenanzas", name: "Contra las falsas ensenanzas", category: "Advertencias" },
  { slug: "pecado-y-tentacion", name: "Pecado y tentacion", category: "Advertencias" },
  { slug: "idolatria", name: "Idolatria", category: "Advertencias" },
  { slug: "mundanalidad", name: "Mundanalidad", category: "Advertencias" },
  { slug: "apostasia", name: "Apostasia", category: "Advertencias" },
  { slug: "legalismo", name: "Legalismo y libertad", category: "Advertencias" },
  { slug: "amor", name: "Amor", category: "Caracter" },
  { slug: "esperanza", name: "Esperanza", category: "Caracter" },
  { slug: "gozo", name: "Gozo", category: "Caracter" },
  { slug: "paz", name: "Paz", category: "Caracter" },
  { slug: "paciencia", name: "Paciencia", category: "Caracter" },
  { slug: "integridad", name: "Integridad", category: "Caracter" },
  { slug: "sabiduria", name: "Sabiduria", category: "Caracter" },
  { slug: "gratitud", name: "Gratitud", category: "Caracter" },
  { slug: "avivamiento", name: "Avivamiento", category: "Caracter" },
];

// ---------------------------------------------------------------------------
// 4. MOTIVOS / OCASIONES
// ---------------------------------------------------------------------------

export const occasions: CatalogItem[] = [
  { slug: "dominical", name: "Servicio dominical", description: "Predicacion regular de domingo." },
  { slug: "serie-expositiva", name: "Serie de sermones", description: "Parte de una serie expositiva continua." },
  { slug: "adviento", name: "Adviento", description: "Tiempo de preparacion para la Navidad." },
  { slug: "navidad", name: "Navidad", description: "Celebracion del nacimiento de Cristo." },
  { slug: "cuaresma", name: "Cuaresma", description: "Tiempo de reflexion previo a la Pascua." },
  { slug: "semana-santa", name: "Semana Santa", description: "Pasion y muerte de Cristo." },
  { slug: "viernes-santo", name: "Viernes Santo", description: "La crucifixion del Senor." },
  { slug: "resurreccion", name: "Domingo de Resurreccion", description: "Celebracion de la resurreccion de Cristo." },
  { slug: "pentecostes", name: "Pentecostes", description: "La venida del Espiritu Santo." },
  { slug: "ano-nuevo", name: "Ano Nuevo", description: "Inicio de un nuevo ano." },
  { slug: "dia-del-padre", name: "Dia del Padre", description: "Mensaje dedicado a los padres." },
  { slug: "dia-de-la-madre", name: "Dia de la Madre", description: "Mensaje dedicado a las madres." },
  { slug: "dia-del-nino", name: "Dia del Nino", description: "Mensaje dedicado a la ninez." },
  { slug: "accion-de-gracias", name: "Accion de Gracias", description: "Celebracion de gratitud." },
  { slug: "aniversario-iglesia", name: "Aniversario de la iglesia", description: "Celebracion del aniversario congregacional." },
  { slug: "santa-cena", name: "Santa Cena", description: "Servicio de la Cena del Senor." },
  { slug: "bautismos", name: "Bautismos", description: "Servicio de bautismo de creyentes." },
  { slug: "dedicacion-de-ninos", name: "Dedicacion de ninos", description: "Presentacion de ninos." },
  { slug: "boda", name: "Boda", description: "Ceremonia matrimonial." },
  { slug: "funeral", name: "Funeral", description: "Servicio de despedida y consuelo." },
  { slug: "ordenacion", name: "Ordenacion", description: "Consagracion al ministerio." },
  { slug: "evangelistico", name: "Evangelistico / Campana", description: "Mensaje con llamado a la salvacion." },
  { slug: "misiones", name: "Domingo de misiones", description: "Enfasis misionero." },
  { slug: "juventud", name: "Servicio de jovenes", description: "Mensaje para la juventud." },
  { slug: "mujeres", name: "Reunion de mujeres", description: "Mensaje para mujeres." },
  { slug: "hombres", name: "Reunion de hombres", description: "Mensaje para hombres." },
  { slug: "matrimonios", name: "Encuentro de matrimonios", description: "Mensaje para parejas." },
  { slug: "avivamiento", name: "Servicio de avivamiento", description: "Mensaje de avivamiento y consagracion." },
  { slug: "consagracion", name: "Consagracion / Inicio de ano", description: "Mensaje de dedicacion y compromiso." },
];

// ---------------------------------------------------------------------------
// 5. TIPOS DE SERMON
// ---------------------------------------------------------------------------

export const sermonTypes: CatalogItem[] = [
  { slug: "expositivo", name: "Expositivo", description: "El pasaje biblico gobierna la estructura y el contenido." },
  { slug: "textual", name: "Textual", description: "Un texto breve cuyas partes forman las divisiones del sermon." },
  { slug: "tematico", name: "Tematico / Topico", description: "Un tema desarrollado con textos de distintos lugares." },
  { slug: "narrativo", name: "Narrativo", description: "Comunica la verdad a traves de una historia y trama." },
  { slug: "biografico", name: "Biografico", description: "Estudia la vida de un personaje biblico." },
  { slug: "doctrinal", name: "Doctrinal", description: "Explica y aplica una verdad doctrinal." },
  { slug: "devocional", name: "Devocional / Inspiracional", description: "Edifica y anima la vida espiritual." },
  { slug: "evangelistico", name: "Evangelistico", description: "Presenta el evangelio con llamado a la salvacion." },
];

// ---------------------------------------------------------------------------
// 6. ESTRATEGIAS / FORMAS DE PREDICACION
// ---------------------------------------------------------------------------

export const strategies: Strategy[] = [
  { slug: "idea-central", name: "Idea central (Big Idea)", author: "Haddon Robinson", description: "Todo el sermon gira en torno a una sola idea dominante." },
  { slug: "cristocentrica", name: "Cristocentrica / redentor-historica", author: "Bryan Chapell", description: "Conecta el texto con Cristo y la redencion (enfoque en la condicion caida)." },
  { slug: "narrativa-lowry", name: "Predicacion narrativa (Lowry Loop)", author: "Eugene Lowry", description: "Estructura de trama: tension, complicacion, giro y resolucion." },
  { slug: "cuatro-paginas", name: "Las Cuatro Paginas del sermon", author: "Paul Scott Wilson", description: "Problema en el texto y en el mundo, gracia en el texto y en el mundo." },
  { slug: "movimientos-stanley", name: "Predicacion de movimientos / un punto", author: "Andy Stanley", description: "Un solo punto memorable: yo - nosotros - Dios - tu - nosotros." },
  { slug: "puente-stott", name: "El puente entre dos mundos", author: "John Stott", description: "Tiende un puente entre el mundo del texto y el del oyente." },
  { slug: "exposicion-narrativa", name: "Exposicion narrativa", author: "Calvin Miller", description: "Une el rigor expositivo con el arte de contar historias." },
  { slug: "predicacion-inductiva", name: "Predicacion inductiva", author: "Fred Craddock", description: "Lleva al oyente de lo particular a la conclusion, descubriendola con el." },
  { slug: "expositiva-contemporanea", name: "Predicacion expositiva contemporanea", author: "David Helm / Donald Sunukjian", description: "Exposicion fiel del texto comunicada con claridad para hoy." },
];

// ---------------------------------------------------------------------------
// 7. METODOS DE PREPARACION
// ---------------------------------------------------------------------------

export const methods: Method[] = [
  {
    slug: "peica",
    name: "PEICA",
    description: "Estructura cada punto del sermon en cinco pasos claros.",
    steps: [
      "Presentacion: introduce el tema y el texto captando la atencion",
      "Explicacion: exegesis de lo que el texto dice y significa",
      "Ilustracion: ejemplos que iluminan la verdad",
      "Conclusion: cierre del argumento del punto",
      "Aplicacion: como vivir la verdad en la vida diaria",
    ],
  },
  {
    slug: "idea-central-robinson",
    name: "Idea central (Robinson)",
    author: "Haddon Robinson",
    description: "Del texto a una unica idea homiletica que se desarrolla.",
    steps: [
      "Estudiar el pasaje en su contexto",
      "Formular la idea exegetica del texto",
      "Convertirla en idea homiletica para hoy",
      "Desarrollar, explicar, probar y aplicar la idea",
    ],
  },
  {
    slug: "oia",
    name: "OIA (inductivo)",
    description: "Metodo inductivo de estudio biblico aplicado a la predicacion.",
    steps: [
      "Observacion: que dice el texto",
      "Interpretacion: que significa el texto",
      "Aplicacion: que demanda el texto hoy",
    ],
  },
  {
    slug: "puente",
    name: "Metodo del puente",
    author: "John Stott",
    description: "Tiende un puente entre el mundo biblico y el mundo actual.",
    steps: [
      "Comprender el mundo del texto",
      "Comprender el mundo del oyente",
      "Construir el puente entre ambos",
      "Aplicar la verdad de forma concreta",
    ],
  },
  {
    slug: "cuatro-paginas",
    name: "Las Cuatro Paginas",
    author: "Paul Scott Wilson",
    description: "Cuatro movimientos: pecado y gracia, texto y mundo.",
    steps: [
      "Pagina 1: el problema en el texto",
      "Pagina 2: el problema en el mundo de hoy",
      "Pagina 3: la accion de Dios en el texto",
      "Pagina 4: la accion de Dios en el mundo de hoy",
    ],
  },
  {
    slug: "lowry-loop",
    name: "Lowry Loop (narrativo)",
    author: "Eugene Lowry",
    description: "Estructura narrativa basada en una trama de tension y resolucion.",
    steps: [
      "Alterar el equilibrio (plantear la tension)",
      "Analizar la discrepancia",
      "Revelar la pista para la solucion",
      "Experimentar el evangelio",
      "Anticipar las consecuencias",
    ],
  },
  {
    slug: "cristocentrico-fcf",
    name: "Cristocentrico (FCF)",
    author: "Bryan Chapell",
    description: "Identifica la condicion caida y la respuesta de la gracia en Cristo.",
    steps: [
      "Identificar la condicion caida que aborda el texto",
      "Explicar el texto en su contexto",
      "Mostrar la respuesta de la gracia en Cristo",
      "Aplicar con motivacion del evangelio",
    ],
  },
  {
    slug: "hook-book-look-took",
    name: "Hook-Book-Look-Took",
    author: "Howard Hendricks",
    description: "Cuatro fases: captar, estudiar, interpretar y aplicar.",
    steps: [
      "Hook: captar el interes",
      "Book: estudiar el texto biblico",
      "Look: interpretar el significado",
      "Took: aplicar a la vida",
    ],
  },
  {
    slug: "bosquejo-tradicional",
    name: "Bosquejo expositivo tradicional",
    description: "Estructura clasica de introduccion, divisiones y conclusion.",
    steps: [
      "Introduccion que presenta el tema",
      "Proposicion o tesis del sermon",
      "Divisiones principales con subpuntos",
      "Conclusion con llamado y aplicacion",
    ],
  },
];

// ---------------------------------------------------------------------------
// 8. COMENTARISTAS
// ---------------------------------------------------------------------------

export const commentators: Commentator[] = [
  { slug: "matthew-henry", name: "Matthew Henry", group: "Clasicos", note: "Comentario devocional y practico de toda la Biblia." },
  { slug: "juan-calvino", name: "Juan Calvino", group: "Clasicos", note: "Comentarios reformados, exegesis solida." },
  { slug: "charles-spurgeon", name: "Charles Spurgeon", group: "Clasicos", note: "Predicacion rica y cristocentrica." },
  { slug: "adam-clarke", name: "Adam Clarke", group: "Clasicos", note: "Comentario detallado de tradicion wesleyana." },
  { slug: "jonathan-edwards", name: "Jonathan Edwards", group: "Clasicos", note: "Profundidad teologica y afectos religiosos." },
  { slug: "john-macarthur", name: "John MacArthur", group: "Evangelicos modernos", note: "Comentario expositivo del Nuevo Testamento." },
  { slug: "william-macdonald", name: "William MacDonald", group: "Evangelicos modernos", note: "Comentario biblico accesible para creyentes." },
  { slug: "warren-wiersbe", name: "Warren Wiersbe", group: "Evangelicos modernos", note: "Serie 'Se', practica y pastoral." },
  { slug: "john-stott", name: "John Stott", group: "Evangelicos modernos", note: "Serie La Biblia habla hoy, exposicion equilibrada." },
  { slug: "rc-sproul", name: "R.C. Sproul", group: "Evangelicos modernos", note: "Comentario reformado y claro." },
  { slug: "tim-keller", name: "Tim Keller", group: "Evangelicos modernos", note: "Aplicacion cristocentrica y cultural." },
  { slug: "da-carson", name: "D.A. Carson", group: "Evangelicos modernos", note: "Exegesis academica rigurosa." },
  { slug: "craig-keener", name: "Craig Keener", group: "Evangelicos modernos", note: "Comentario del trasfondo cultural." },
  { slug: "comentario-mundo-hispano", name: "Comentario Biblico Mundo Hispano", group: "En espanol", note: "Obra de referencia en espanol." },
  { slug: "samuel-perez-millos", name: "Samuel Perez Millos", group: "En espanol", note: "Comentario exegetico del texto griego." },
  { slug: "justo-gonzalez", name: "Justo L. Gonzalez", group: "En espanol", note: "Perspectiva historica y latinoamericana." },
  { slug: "stanley-horton", name: "Stanley Horton", group: "Pentecostales", note: "Comentario Biblico Pentecostal." },
  { slug: "biblia-estudio-pentecostal", name: "Biblia de Estudio Pentecostal", group: "Pentecostales", note: "Notas de Donald Stamps, enfoque pentecostal." },
  { slug: "french-arrington", name: "French Arrington", group: "Pentecostales", note: "Teologia y exegesis pentecostal." },
  { slug: "charles-swindoll", name: "Charles Swindoll", group: "Devocionales", note: "Aplicacion practica y pastoral." },
  { slug: "max-lucado", name: "Max Lucado", group: "Devocionales", note: "Estilo narrativo y devocional." },
];

// ---------------------------------------------------------------------------
// 9. RECURSOS / ILUSTRACIONES
// ---------------------------------------------------------------------------

export const illustrationKinds: CatalogItem[] = [
  { slug: "vida-cotidiana", name: "Ejemplos de la vida cotidiana", description: "Situaciones comunes y actuales." },
  { slug: "historicos", name: "Ejemplos historicos", description: "Hechos y personajes de la historia." },
  { slug: "biblicos", name: "Ejemplos biblicos", description: "Pasajes y personajes de la Escritura." },
  { slug: "testimonios", name: "Testimonios", description: "Historias de fe y transformacion." },
  { slug: "naturaleza-ciencia", name: "Naturaleza y ciencia", description: "Analogias del mundo natural." },
  { slug: "metaforas", name: "Metaforas e imagenes", description: "Comparaciones que iluminan la verdad." },
];

// ---------------------------------------------------------------------------
// 10. OPCIONES DE LONGITUD Y VERSICULOS
// ---------------------------------------------------------------------------

export const lengths = [
  { key: "corto", name: "Corto", description: "Aprox. 10-15 minutos (900-1300 palabras)." },
  { key: "medio", name: "Mediano", description: "Aprox. 20-30 minutos (1800-2600 palabras)." },
  { key: "largo", name: "Largo", description: "Aprox. 35-45 minutos (3200-4200 palabras)." },
] as const;

export const verseOptions = [
  { key: "solo-cita", name: "Solo la cita", description: "Solo la referencia (ej. Juan 3:16)." },
  { key: "texto-completo", name: "Texto completo", description: "Incluye el versiculo escrito completo." },
] as const;

// ---------------------------------------------------------------------------
// 11. ESTILOS DE DIAPOSITIVA (prompts pregenerados)
// ---------------------------------------------------------------------------

export const slideStyles: SlideStyle[] = [
  {
    slug: "hillsong",
    name: "Hillsong",
    promptBase:
      "Fondo atmosferico oscuro con neblina y destellos de luz suave, degradado azul y violeta profundo, estetica de adoracion moderna, tipografia limpia y minimalista, amplio espacio negativo, sensacion eterea y de reverencia",
    example: "Una atmosfera oscura y envolvente con luz suave que invita a la adoracion.",
  },
  {
    slug: "elevation-worship",
    name: "Elevation Worship",
    promptBase:
      "Estetica urbana de alto contraste, textura de hormigon o industrial, tipografia grande y audaz, blanco y negro con un unico color de acento, sensacion juvenil, moderna y energica",
    example: "Diseno urbano, audaz y de alto impacto, con tipografia grande.",
  },
  {
    slug: "arcilla",
    name: "Arcilla (claymation)",
    promptBase:
      "Render 3D estilo plastilina, texturas mate de arcilla, iluminacion suave de estudio, colores pastel calidos, aspecto tierno y artesanal tipo stop-motion",
    example: "Escenas 3D de arcilla, calidas y amigables, ideales para todo publico.",
  },
  {
    slug: "comics",
    name: "Comics",
    promptBase:
      "Ilustracion estilo novela grafica y comic, lineas de tinta marcadas, colores planos y vibrantes, sombreado tipo halftone, composicion dinamica y expresiva",
    example: "Ilustraciones tipo comic, dinamicas y llamativas para jovenes y ninos.",
  },
  {
    slug: "realista",
    name: "Realista",
    promptBase:
      "Fotografia realista, iluminacion natural, alta definicion, escenas humanas autenticas, profundidad de campo, tonos calidos y naturales",
    example: "Imagenes fotorrealistas, sobrias y profesionales.",
  },
  {
    slug: "cinematografico",
    name: "Cinematografico",
    promptBase:
      "Fotograma de pelicula, iluminacion dramatica, gradacion de color cinematografica, formato panoramico, atmosfera epica, grano sutil de film",
    example: "Estetica de cine, dramatica y de gran impacto visual.",
  },
];

export const slideDensities = [
  {
    key: "corta",
    name: "Corta",
    description: "Solo titulo, titulos de las divisiones y versiculos.",
  },
  {
    key: "mediana",
    name: "Mediana",
    description: "Agrega la idea central y puntos breves por division.",
  },
  {
    key: "larga",
    name: "Larga",
    description: "Agrega desarrollo, ilustracion resumida y aplicaciones.",
  },
] as const;

// ---------------------------------------------------------------------------
// 12. ROLES DEL PREDICADOR (onboarding)
// ---------------------------------------------------------------------------

export const roles: CatalogItem[] = [
  { slug: "pastor", name: "Pastor", description: "Lidera una congregacion." },
  { slug: "predicador", name: "Predicador", description: "Predica con regularidad." },
  { slug: "lider", name: "Lider o maestro", description: "Ensena en grupos o ministerios." },
  { slug: "evangelista", name: "Evangelista", description: "Ministerio de evangelismo." },
  { slug: "estudiante", name: "Estudiante", description: "Estudia teologia u homiletica." },
];

// ---------------------------------------------------------------------------
// 13. TIPOS DE CONTENIDO
// ---------------------------------------------------------------------------

export const contentTypes: CatalogItem[] = [
  {
    slug: "sermon",
    name: "Sermon",
    description: "Mensaje para predicar en un servicio.",
  },
  {
    slug: "devocional",
    name: "Reflexion devocional",
    description: "Meditacion breve y personal para edificar.",
  },
  {
    slug: "clase",
    name: "Clase de discipulado",
    description: "Leccion para grupos pequenos con preguntas y dinamicas.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function findBySlug<T extends { slug: string }>(list: T[], slug: string): T | undefined {
  return list.find((item) => item.slug === slug);
}

export function namesFromSlugs<T extends { slug: string; name: string }>(
  list: T[],
  slugs: string[],
): string[] {
  return slugs
    .map((slug) => list.find((item) => item.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));
}
