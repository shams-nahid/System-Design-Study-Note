const { HashMap } = require('./hashMap');

describe('HashMap', () => {
  let hashMap;

  beforeEach(() => {
    hashMap = new HashMap();
  })

  it('should be defined', () => {
    expect(hashMap).toBeDefined();
    expect(hashMap.size).toEqual(0);
  });

  describe('insert operation', () => {
    it('should able to insert key value when hashMap is empty', () => {
      hashMap.insert({ key: 'Air Supply', value: 'Making Love Out of Nothing at all' });
      expect(hashMap.get('Air Supply')).toEqual('Making Love Out of Nothing at all')
    });

    it('should able to insert key value when hashMap is not empty', () => {
      hashMap.insert({ key: 'Air Supply', value: 'Making Love Out of Nothing at all' });
      hashMap.insert({ key: 'Scorpions', value: 'Send Me an Angle' });
      expect(hashMap.get('Air Supply')).toEqual('Making Love Out of Nothing at all')
      expect(hashMap.get('Scorpions')).toEqual('Send Me an Angle')
    });

    it('should remove oldest inserted key value when hashMap is full', () => {
      hashMap.insert({ key: 'Air Supply', value: 'Making Love Out of Nothing at all' });
      hashMap.insert({ key: 'Scorpions', value: 'Send Me an Angle' });
      hashMap.insert({ key: 'Gun"s & Roses', value: 'Sweet Child O Mine' });
      hashMap.insert({ key: 'Led Zeepline', value: 'Stairway To Heaven' });

      expect(hashMap.get('Air Supply')).toEqual(null)
      expect(hashMap.get('Scorpions')).toEqual('Send Me an Angle')
      expect(hashMap.get('Gun"s & Roses')).toEqual('Sweet Child O Mine')
      expect(hashMap.get('Led Zeepline')).toEqual('Stairway To Heaven')
    });

    it.only('should remove oldest accessed key value when hashMap is full', () => {
      hashMap.insert({ key: 'Air Supply', value: 'Making Love Out of Nothing at all' });
      hashMap.insert({ key: 'Scorpions', value: 'Send Me an Angle' });
      hashMap.insert({ key: 'Gun"s & Roses', value: 'Sweet Child O Mine' });
      hashMap.get('Air Supply');
      hashMap.insert({ key: 'Led Zeepline', value: 'Stairway To Heaven' });

      expect(hashMap.get('Scorpions')).toEqual(null)

    });
  })

});