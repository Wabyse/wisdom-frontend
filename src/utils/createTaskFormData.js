export const createTaskFormData = (user, task, description, startDate, startTime, endDate, endTime, importance, subCategory, form, file, userInfo) => {
    const formData = new FormData();
    formData.append("importance", importance);
    formData.append("task", task);
    formData.append("description", description);
    formData.append(
      "start_date",
      new Date(`${startDate}T${startTime || "00:00"}`).toISOString()
    );
    formData.append(
      "end_date",
      new Date(`${endDate}T${endTime || "00:00"}`).toISOString()
    );
    formData.append("file", file);
    formData.append("sub_category", Number(subCategory));
    formData.append("assignedBy_id", userInfo?.employee_id);
    formData.append("assignee_id", Number(user));
    formData.append("uploadType", "task");
    console.log(formData)
    return formData;
  };
  