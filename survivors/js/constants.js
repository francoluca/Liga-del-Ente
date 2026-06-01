const DB_KEY = 'liga_survivors_v1_0';
const RANKS = ['Ceniza', 'Bronce', 'Plata', 'Oro', 'Iridiscente'];
const GENERIC_POOL = [
    'carne_resbaladiza', 'caza_menor', 'de_pies_ligeros', 'deja_vu', 'escalofrios', 'esperanza',
    'esto_no_puede_estar_pasando', 'familia', 'instinto_saqueador', 'nadie_se_queda_atras',
    'percepcion_oscura', 'premonicion', 'resiliencia', 'sobreviviremos', 'agilidad', 'alerta',
    'autocuracion', 'baila_conmigo', 'camaraderia', 'conocimientos_de_botanica', 'conexion_empatica',
    'despierta', 'el_temple_del_hombre', 'esprint', 'evasion_urbana', 'fortaleza_en_las_sombras',
    'golpe_decisivo', 'inquebrantable', 'lider', 'me_da_igual', 'nos_vemos', 'objeto_de_obsesion',
    'sabotear', 'solidaridad', 'tenacidad', 'vinculo', 'voluntad_de_hierro'
];
const POINTS = { WIN: 1, LOSS: 0 };
const ANIMATION_DURATIONS = { ROULETTE_TICK: 50, HIGHLIGHT: 4000, MODAL_DELAY: 2800 };