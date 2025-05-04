export const createTaskFormData = (form, file, userInfo) => {
    const formData = new FormData();
    formData.append("importance", form.importance.value);
    formData.append("task", form.task.value);
    formData.append("description", form.description.value);
    formData.append(
      "start_date",
      new Date(`${form.startDate.value}T${form.startTime.value || "00:00"}`).toISOString()
    );
    formData.append(
      "end_date",
      new Date(`${form.endDate.value}T${form.endTime.value || "00:00"}`).toISOString()
    );
    formData.append("file", file);
    formData.append("sub_category", form.subCategory.value);
    formData.append("assignedBy_id", userInfo?.employee_id);
    formData.append("assignee_id", form.user.value);
    formData.append("uploadType", "task");
    return formData;
  };
  