import moment from 'moment';

export const colourOptions = [
    { value: moment().subtract(1, 'days').format('YYYY-MM-DD'), label: `Yesterday ( ${moment().subtract(1, 'days').format('LL').split(',')[0]} )`, color: '#0052CC' },
    { value:moment().format('YYYY-MM-DD'), label: `Today ( ${moment().format('LL').split(',')[0]} )`, color: '#00B8D9' },
    { value: moment().add(1, 'days').format('YYYY-MM-DD'), label:  `Tomorrow ( ${moment().add(1, 'days').format('LL').split(',')[0]} )`, color: '#5243AA', isFixed: true },
  ];

export const shiftOptions = [
  { value: 'evening', label: 'Evening(4pm-10pm)', color: '#00B8D9', style:{ cursor: "pointer" } },
  { value: 'afternoon', label: 'Afternoon(12pm-4pm)', color: '#0052CC' },
  { value:'morning', label: 'Morning(9am-12pm)', color: '#5243AA', isFixed: true },
  { value:'early-morning', label:'Early Morning(6am-9am)'  , color: '#5243AA', isFixed: true },
];