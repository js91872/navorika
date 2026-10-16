export type Paper = {name:string; slug:string; width:number; height:number; group:string; note:string};
export const paperSizes:Paper[]=[
{name:'A0',slug:'a0',width:841,height:1189,group:'ISO A',note:'Large posters and technical drawings'},
{name:'A1',slug:'a1',width:594,height:841,group:'ISO A',note:'Posters and presentation drawings'},
{name:'A2',slug:'a2',width:420,height:594,group:'ISO A',note:'Posters and artwork'},
{name:'A3',slug:'a3',width:297,height:420,group:'ISO A',note:'Drawings, diagrams and larger prints'},
{name:'A4',slug:'a4',width:210,height:297,group:'ISO A',note:'Documents, letters and everyday printing'},
{name:'A5',slug:'a5',width:148,height:210,group:'ISO A',note:'Notebooks, planners and small leaflets'},
{name:'A6',slug:'a6',width:105,height:148,group:'ISO A',note:'Postcards and invitation cards'},
{name:'A7',slug:'a7',width:74,height:105,group:'ISO A',note:'Small notes and pocket cards'},
{name:'B4',slug:'b4',width:250,height:353,group:'ISO B',note:'Books and larger documents'},
{name:'B5',slug:'b5',width:176,height:250,group:'ISO B',note:'Books and notebooks'},
{name:'B6',slug:'b6',width:125,height:176,group:'ISO B',note:'Small books'},
{name:'US Letter',slug:'us-letter',width:215.9,height:279.4,group:'US',note:'Standard US office documents'},
{name:'US Legal',slug:'us-legal',width:215.9,height:355.6,group:'US',note:'Legal forms and long documents'},
{name:'US Tabloid',slug:'tabloid',width:279.4,height:431.8,group:'US',note:'11 by 17 inch printing'},
{name:'US Ledger',slug:'ledger',width:431.8,height:279.4,group:'US',note:'17 by 11 inch landscape prints'},
{name:'Half Letter',slug:'half-letter',width:139.7,height:215.9,group:'US',note:'5.5 by 8.5 inch planners and booklets'},
{name:'ANSI C',slug:'ansi-c',width:431.8,height:558.8,group:'ANSI',note:'17 by 22 inch engineering drawings'},
{name:'ANSI D',slug:'ansi-d',width:558.8,height:863.6,group:'ANSI',note:'22 by 34 inch engineering drawings'},
{name:'ANSI E',slug:'ansi-e',width:863.6,height:1117.6,group:'ANSI',note:'34 by 44 inch engineering drawings'}
];
export const inch=(mm:number)=>mm/25.4;
export const pixels=(mm:number,dpi:number)=>Math.round(inch(mm)*dpi);
