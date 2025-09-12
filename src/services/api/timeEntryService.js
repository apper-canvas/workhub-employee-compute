const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TimeEntryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'time_entry_c';
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "hours_worked_c"}},
          {"field": {"Name": "date_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching time entries:", error);
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
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "hours_worked_c"}},
          {"field": {"Name": "date_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Time entry with Id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching time entry ${id}:`, error);
      throw error;
    }
  }

  async getByEmployeeId(employeeId) {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "hours_worked_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching time entries by employee:", error);
      throw error;
    }
  }

  async getCurrentTimeEntry(employeeId) {
    await delay(200);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "clock_in_c"}},
          {"field": {"Name": "clock_out_c"}},
          {"field": {"Name": "hours_worked_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]},
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [today]}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const entries = response.data || [];
      return entries.length > 0 ? entries[0] : null;
    } catch (error) {
      console.error("Error fetching current time entry:", error);
      return null;
    }
  }

  async clockIn(employeeId) {
    await delay(400);
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      // Check if already clocked in today
      const currentEntry = await this.getCurrentTimeEntry(employeeId);
      if (currentEntry && !currentEntry.clock_out_c) {
        throw new Error("Already clocked in for today");
      }

      const params = {
        records: [{
          Name: `Time Entry - ${today}`,
          employee_id_c: parseInt(employeeId),
          clock_in_c: now,
          clock_out_c: null,
          hours_worked_c: 0,
          date_c: today
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
          console.error(`Failed to clock in:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to clock in");
    } catch (error) {
      console.error("Error clocking in:", error);
      throw error;
    }
  }

  async clockOut(employeeId) {
    await delay(400);
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      const currentEntry = await this.getCurrentTimeEntry(employeeId);
      if (!currentEntry || currentEntry.clock_out_c) {
        throw new Error("No active clock-in found for today");
      }

      const clockInTime = new Date(currentEntry.clock_in_c);
      const clockOutTime = new Date(now);
      const hoursWorked = (clockOutTime - clockInTime) / (1000 * 60 * 60);

      const params = {
        records: [{
          Id: currentEntry.Id,
          clock_out_c: now,
          hours_worked_c: Math.round(hoursWorked * 100) / 100
        }]
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
          console.error(`Failed to clock out:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to clock out");
    } catch (error) {
      console.error("Error clocking out:", error);
      throw error;
    }
  }

  async create(entryData) {
    await delay(400);
    try {
      const params = {
        records: [{
          Name: entryData.Name || `Time Entry - ${entryData.date_c || new Date().toISOString().split('T')[0]}`,
          employee_id_c: parseInt(entryData.employee_id_c),
          clock_in_c: entryData.clock_in_c,
          clock_out_c: entryData.clock_out_c,
          hours_worked_c: entryData.hours_worked_c || 0,
          date_c: entryData.date_c || new Date().toISOString().split('T')[0]
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
          console.error(`Failed to create time entry:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create time entry");
    } catch (error) {
      console.error("Error creating time entry:", error);
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
      if (updateData.employee_id_c !== undefined) updateRecord.employee_id_c = parseInt(updateData.employee_id_c);
      if (updateData.clock_in_c !== undefined) updateRecord.clock_in_c = updateData.clock_in_c;
      if (updateData.clock_out_c !== undefined) updateRecord.clock_out_c = updateData.clock_out_c;
      if (updateData.hours_worked_c !== undefined) updateRecord.hours_worked_c = updateData.hours_worked_c;
      if (updateData.date_c !== undefined) updateRecord.date_c = updateData.date_c;

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
          console.error(`Failed to update time entry ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error(`Time entry with Id ${id} not found`);
    } catch (error) {
      console.error(`Error updating time entry ${id}:`, error);
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
          console.error(`Failed to delete time entry ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting time entry ${id}:`, error);
      throw error;
    }
  }

  async getWeeklyHours(employeeId) {
    await delay(300);
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startDate = startOfWeek.toISOString().split('T')[0];
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const endDate = endOfWeek.toISOString().split('T')[0];

      const params = {
        fields: [
          {"field": {"Name": "hours_worked_c"}}
        ],
        where: [
          {"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)]},
          {"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      const entries = response.data || [];
      return entries.reduce((total, entry) => total + (entry.hours_worked_c || 0), 0);
    } catch (error) {
      console.error("Error fetching weekly hours:", error);
      return 0;
    }
  }
}

export default new TimeEntryService();