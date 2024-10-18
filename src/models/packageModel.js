class PackageModel {
    static async getAllPackages() {
      // اینجا باید از پایگاه داده پکیج‌ها را بازیابی کنید
      return [
        { id: 1, name: 'پکیج برنزی', price: 100000, duration: 30, volume: 50, server: 'آلمان', description: 'پکیج مناسب برای استفاده روزانه' },
        { id: 2, name: 'پکیج نقره‌ای', price: 200000, duration: 60, volume: 100, server: 'هلند', description: 'پکیج مناسب برای استفاده متوسط' },
        // ...
      ];
    }
  
    static async getPackageById(id) {
      const packages = await this.getAllPackages();
      return packages.find(pkg => pkg.id === id);
    }
  }
  
  module.exports = PackageModel;
  