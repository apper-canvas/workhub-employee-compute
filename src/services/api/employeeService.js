const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EmployeeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'employee_c';
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  }

  async getById(id) {
    await delay(200);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Employee with Id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  }

  async getCurrentEmployee() {
    await delay(200);
    try {
      // For demo purposes, we'll return the first employee
      // In a real app, this would get the current authenticated user
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "avatar_c"}}
        ],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("No employee found");
      }

      return response.data[0];
    } catch (error) {
      console.error("Error fetching current employee:", error);
      throw error;
    }
  }

  async create(employeeData) {
    await delay(400);
    try {
      const params = {
        records: [{
          Name: employeeData.Name || employeeData.name_c || "New Employee",
          name_c: employeeData.name_c,
          email_c: employeeData.email_c,
          department_c: employeeData.department_c,
          position_c: employeeData.position_c,
          start_date_c: employeeData.start_date_c || new Date().toISOString().split('T')[0],
          avatar_c: employeeData.avatar_c
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create employee:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create employee");
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    await delay(400);
    try {
      const updateRecord = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updateData.Name !== undefined) updateRecord.Name = updateData.Name;
      if (updateData.name_c !== undefined) updateRecord.name_c = updateData.name_c;
      if (updateData.email_c !== undefined) updateRecord.email_c = updateData.email_c;
      if (updateData.department_c !== undefined) updateRecord.department_c = updateData.department_c;
      if (updateData.position_c !== undefined) updateRecord.position_c = updateData.position_c;
      if (updateData.start_date_c !== undefined) updateRecord.start_date_c = updateData.start_date_c;
      if (updateData.avatar_c !== undefined) updateRecord.avatar_c = updateData.avatar_c;

      const params = {
        records: [updateRecord]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update employee ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error(`Employee with Id ${id} not found`);
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    await delay(300);
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete employee ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error);
      throw error;
    }
  }
}

export default new EmployeeService();