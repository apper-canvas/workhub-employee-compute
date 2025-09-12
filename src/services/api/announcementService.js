import announcementsData from "@/services/mockData/announcements.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AnnouncementService {
  constructor() {
    this.announcements = [...announcementsData];
  }

  async getAll() {
    await delay(300);
    return [...this.announcements].sort((a, b) => 
      new Date(b.publishDate) - new Date(a.publishDate)
    );
  }

  async getById(id) {
    await delay(200);
    const announcement = this.announcements.find(ann => ann.Id === parseInt(id));
    if (!announcement) {
      throw new Error(`Announcement with Id ${id} not found`);
    }
    return { ...announcement };
  }

  async getRecent(limit = 3) {
    await delay(250);
    return [...this.announcements]
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, limit)
      .map(ann => ({ ...ann }));
  }

  async markAsRead(id, userId = "current-user") {
    await delay(200);
    const index = this.announcements.findIndex(ann => ann.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Announcement with Id ${id} not found`);
    }

    if (!this.announcements[index].readBy.includes(userId)) {
      this.announcements[index].readBy.push(userId);
    }
    
    return { ...this.announcements[index] };
  }

  async getUnreadCount(userId = "current-user") {
    await delay(150);
    return this.announcements.filter(ann => !ann.readBy.includes(userId)).length;
  }

  async create(announcementData) {
    await delay(400);
    const maxId = Math.max(...this.announcements.map(ann => ann.Id), 0);
    const newAnnouncement = {
      Id: maxId + 1,
      ...announcementData,
      publishDate: new Date().toISOString(),
      readBy: []
    };
    this.announcements.push(newAnnouncement);
    return { ...newAnnouncement };
  }

  async update(id, updateData) {
    await delay(400);
    const index = this.announcements.findIndex(ann => ann.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Announcement with Id ${id} not found`);
    }
    this.announcements[index] = { ...this.announcements[index], ...updateData };
    return { ...this.announcements[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.announcements.findIndex(ann => ann.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Announcement with Id ${id} not found`);
    }
    this.announcements.splice(index, 1);
    return true;
  }
}

export default new AnnouncementService();