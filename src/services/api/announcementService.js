const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AnnouncementService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'announcement_c';
  }

  async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "publish_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "read_by_c"}}
        ],
        orderBy: [{"fieldName": "publish_date_c", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching announcements:", error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "publish_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "read_by_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Announcement with Id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching announcement ${id}:`, error);
      throw error;
    }
  }

  async getRecent(limit = 3) {
    await delay(250);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "publish_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "read_by_c"}}
        ],
        orderBy: [{"fieldName": "publish_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent announcements:", error);
      throw error;
    }
  }

  async markAsRead(id, userId = "current-user") {
    await delay(200);
    try {
      // First get the current announcement
      const announcement = await this.getById(id);
      if (!announcement) {
        throw new Error(`Announcement with Id ${id} not found`);
      }

      // Parse current read_by list
      let readByList = [];
      if (announcement.read_by_c) {
        readByList = announcement.read_by_c.split('\n').filter(u => u.trim());
      }

      // Add user if not already in list
      if (!readByList.includes(userId)) {
        readByList.push(userId);
      }

      // Update the announcement
      const params = {
        records: [{
          Id: parseInt(id),
          read_by_c: readByList.join('\n')
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
          console.error(`Failed to mark announcement as read:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return announcement;
    } catch (error) {
      console.error(`Error marking announcement ${id} as read:`, error);
      throw error;
    }
  }

  async getUnreadCount(userId = "current-user") {
    await delay(150);
    try {
      const announcements = await this.getAll();
      return announcements.filter(ann => {
        const readByList = ann.read_by_c ? ann.read_by_c.split('\n').filter(u => u.trim()) : [];
        return !readByList.includes(userId);
      }).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  async create(announcementData) {
    await delay(400);
    try {
      const params = {
        records: [{
          Name: announcementData.Name || announcementData.title_c || "New Announcement",
          title_c: announcementData.title_c,
          content_c: announcementData.content_c,
          publish_date_c: new Date().toISOString(),
          priority_c: announcementData.priority_c || "medium",
          read_by_c: ""
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
          console.error(`Failed to create announcement:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create announcement");
    } catch (error) {
      console.error("Error creating announcement:", error);
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
      if (updateData.title_c !== undefined) updateRecord.title_c = updateData.title_c;
      if (updateData.content_c !== undefined) updateRecord.content_c = updateData.content_c;
      if (updateData.publish_date_c !== undefined) updateRecord.publish_date_c = updateData.publish_date_c;
      if (updateData.priority_c !== undefined) updateRecord.priority_c = updateData.priority_c;
      if (updateData.read_by_c !== undefined) updateRecord.read_by_c = updateData.read_by_c;

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
          console.error(`Failed to update announcement ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error(`Announcement with Id ${id} not found`);
    } catch (error) {
      console.error(`Error updating announcement ${id}:`, error);
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
          console.error(`Failed to delete announcement ${id}:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting announcement ${id}:`, error);
      throw error;
    }
  }
}

export default new AnnouncementService();