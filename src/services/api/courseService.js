// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'course_c';

export const courseService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c || course.Name || '',
        code: course.code_c || '',
        instructor: course.instructor_c || '',
        credits: course.credits_c || 3,
        color: course.color_c || '#4F46E5',
        schedule: course.schedule_c ? course.schedule_c.split(',').map(s => s.trim()) : [],
        currentGrade: course.current_grade_c || 0,
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : [
          { name: "Exams", weight: 40 },
          { name: "Assignments", weight: 35 },
          { name: "Participation", weight: 15 },
          { name: "Projects", weight: 10 }
        ]
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "grade_categories_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c || course.Name || '',
        code: course.code_c || '',
        instructor: course.instructor_c || '',
        credits: course.credits_c || 3,
        color: course.color_c || '#4F46E5',
        schedule: course.schedule_c ? course.schedule_c.split(',').map(s => s.trim()) : [],
        currentGrade: course.current_grade_c || 0,
        gradeCategories: course.grade_categories_c ? JSON.parse(course.grade_categories_c) : []
      };
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const params = {
        records: [{
          Name: courseData.name,
          name_c: courseData.name,
          code_c: courseData.code,
          instructor_c: courseData.instructor,
          credits_c: courseData.credits,
          color_c: courseData.color,
          schedule_c: Array.isArray(courseData.schedule) ? courseData.schedule.join(', ') : '',
          current_grade_c: 0,
          grade_categories_c: JSON.stringify(courseData.gradeCategories || [
            { name: "Exams", weight: 40 },
            { name: "Assignments", weight: 35 },
            { name: "Participation", weight: 15 },
            { name: "Projects", weight: 10 }
          ])
        }]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          const newCourse = successfulRecords[0].data;
          return {
            Id: newCourse.Id,
            name: newCourse.name_c || newCourse.Name || '',
            code: newCourse.code_c || '',
            instructor: newCourse.instructor_c || '',
            credits: newCourse.credits_c || 3,
            color: newCourse.color_c || '#4F46E5',
            schedule: newCourse.schedule_c ? newCourse.schedule_c.split(',').map(s => s.trim()) : [],
            currentGrade: newCourse.current_grade_c || 0,
            gradeCategories: newCourse.grade_categories_c ? JSON.parse(newCourse.grade_categories_c) : []
          };
        }
      }
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.name,
          name_c: updateData.name,
          code_c: updateData.code,
          instructor_c: updateData.instructor,
          credits_c: updateData.credits,
          color_c: updateData.color,
          schedule_c: Array.isArray(updateData.schedule) ? updateData.schedule.join(', ') : updateData.schedule,
          current_grade_c: updateData.currentGrade || 0,
          grade_categories_c: updateData.gradeCategories ? JSON.stringify(updateData.gradeCategories) : undefined
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedCourse = successfulUpdates[0].data;
          return {
            Id: updatedCourse.Id,
            name: updatedCourse.name_c || updatedCourse.Name || '',
            code: updatedCourse.code_c || '',
            instructor: updatedCourse.instructor_c || '',
            credits: updatedCourse.credits_c || 3,
            color: updatedCourse.color_c || '#4F46E5',
            schedule: updatedCourse.schedule_c ? updatedCourse.schedule_c.split(',').map(s => s.trim()) : [],
            currentGrade: updatedCourse.current_grade_c || 0,
            gradeCategories: updatedCourse.grade_categories_c ? JSON.parse(updatedCourse.grade_categories_c) : []
          };
        }
      }
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      return false;
    }
  },

  async updateGrade(id, grade) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          current_grade_c: grade
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          const updatedCourse = successfulUpdates[0].data;
          return {
            Id: updatedCourse.Id,
            name: updatedCourse.name_c || updatedCourse.Name || '',
            code: updatedCourse.code_c || '',
            instructor: updatedCourse.instructor_c || '',
            credits: updatedCourse.credits_c || 3,
            color: updatedCourse.color_c || '#4F46E5',
            schedule: updatedCourse.schedule_c ? updatedCourse.schedule_c.split(',').map(s => s.trim()) : [],
            currentGrade: updatedCourse.current_grade_c || 0,
            gradeCategories: updatedCourse.grade_categories_c ? JSON.parse(updatedCourse.grade_categories_c) : []
          };
        }
      }
    } catch (error) {
      console.error("Error updating course grade:", error?.response?.data?.message || error);
      return null;
    }
  }
};