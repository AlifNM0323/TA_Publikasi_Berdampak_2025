import { resolvers } from '../src/resolvers.js'; 

describe('Pengujian Fungsional (Unit Test) - GraphQL Resolvers', () => {
  
  describe('Citizen Resolver', () => {
    
    it('Harus menghitung umur dengan benar berdasarkan dateOfBirth', () => {
   
      const dummyParent = { dateOfBirth: '1990-01-01' };
      
    
      const calculatedAge = resolvers.Citizen.age(dummyParent);
      

      expect(calculatedAge).toBeGreaterThanOrEqual(35);
      expect(calculatedAge).toBeLessThanOrEqual(37);
    });

    it('Harus mengembalikan angka 0 jika dateOfBirth kosong', () => {
      const dummyParent = { dateOfBirth: null };
      const calculatedAge = resolvers.Citizen.age(dummyParent);
      
      expect(calculatedAge).toBe(0);
    });

  });

});