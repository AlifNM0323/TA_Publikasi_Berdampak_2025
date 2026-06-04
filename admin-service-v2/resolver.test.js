import { resolvers } from '../src/resolvers.js'; // Sesuaikan path menuju file resolvers.js kawan

describe('Pengujian Fungsional (Unit Test) - GraphQL Resolvers', () => {
  
  describe('Citizen Resolver', () => {
    
    it('Harus menghitung umur dengan benar berdasarkan dateOfBirth', () => {
      // Simulasi data warga yang lahir tahun 1990
      const dummyParent = { dateOfBirth: '1990-01-01' };
      
      // Memanggil fungsi age dari resolver kawan
      const calculatedAge = resolvers.Citizen.age(dummyParent);
      
      // Karena sekarang 2026, umurnya harusnya sekitar 36 tahun
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