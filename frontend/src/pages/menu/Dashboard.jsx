import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  Users,
  Building,
  GraduationCap,
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
  X,
  RefreshCcw,
} from "lucide-react";
import "../../styles/dashboard.css";
// --- Dashboard Component ---
// This is the main content area of the dashboard, designed to be placed
// inside an existing layout component.
export default function Dashboard() {
  const [activeModel, setActiveModel] = useState("Student");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Base API URL
  const API_URL = "http://localhost:5000/admin";
  const models = [
    {
      name: "Student",
      icon: GraduationCap,
      endpoint: "students",
      pk: "student_id",
    },
    {
      name: "Department",
      icon: Building,
      endpoint: "departments",
      pk: "dept_id",
    },
    { name: "Course", icon: BookOpen, endpoint: "courses", pk: "course_id" },
    {
      name: "Faculty",
      icon: Users,
      endpoint: "faculties",
      pk: "faculty_short_id",
    },
  ];

  // Fetch departments for the Student form dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_URL}/departments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        const departmentsData = await response.json();
        setDepartments(departmentsData);
      } catch (err) {
        console.error("Error fetching departments:", err);
        toast.error("Failed to load departments.");
      }
    };
    fetchDepartments();
  }, []);

  // Generic function to fetch data for the active model
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = models.find((m) => m.name === activeModel).endpoint;
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Please check your network and try again.");
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeModel]);

  const handleCreate = () => {
    setCurrentEditItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsConfirmModalOpen(false);
    try {
      setLoading(true);
      const endpoint = models.find((m) => m.name === activeModel).endpoint;
      const pk = models.find((m) => m.name === activeModel).pk;
      const response = await fetch(
        `${API_URL}/${endpoint}/${itemToDelete[pk]}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast.success(`${activeModel} deleted successfully!`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
      setLoading(false);
    }
  };

  const selectedModel = models.find((m) => m.name === activeModel);
  const dataKeys = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />

      <header className="dashboard-header">
        <h2 className="dashboard-title">{activeModel} Management</h2>
        <div className="button-group">
          {models.map((model) => (
            <button
              key={model.name}
              onClick={() => {
                setActiveModel(model.name);
                setData([]);
              }}
              className={`refresh-button ${
                activeModel === model.name ? "active-model" : ""
              }`}
            >
              <model.icon size={18} className="button-icon" />
              {model.name}
            </button>
          ))}
          <button onClick={fetchData} className="refresh-button">
            <RefreshCcw size={18} className="button-icon" />
            Refresh
          </button>
          <button onClick={handleCreate} className="add-button">
            <PlusCircle size={18} className="button-icon" />
            Add New {activeModel}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-spinner">
          <div></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 p-8 rounded-xl bg-gray-800 shadow-xl">
          {error}
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {dataKeys.map((key) => (
                    <th key={key}>{key.replace(/_/g, " ").toUpperCase()}</th>
                  ))}
                  <th className="action-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {dataKeys.map((key) => (
                      <td key={key}>{String(item[key])}</td>
                    ))}
                    <td className="action-cell">
                      <button
                        onClick={() => handleEdit(item)}
                        className="action-button edit-button"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="action-button delete-button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length === 0 && (
            <div className="no-data-message">
              No {activeModel.toLowerCase()} data found.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <CrudFormModal
          activeModel={activeModel}
          currentEditItem={currentEditItem}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
          API_URL={API_URL}
          models={models}
          departments={departments}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          message={`Are you sure you want to delete this ${activeModel}?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
}

// --- CrudFormModal Component ---
// Modal component for Create/Edit operations
function CrudFormModal({
  activeModel,
  currentEditItem,
  onClose,
  onSuccess,
  API_URL,
  models,
  departments,
}) {
  const selectedModel = models.find((m) => m.name === activeModel);
  const [formData, setFormData] = useState(currentEditItem || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getFormFields = () => {
    switch (activeModel) {
      case "Student":
        return (
          <>
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              value={formData.student_id || ""}
              onChange={handleChange}
              className="input-field"
              disabled={!!currentEditItem}
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name || ""}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="mobile_no"
              placeholder="Mobile Number"
              value={formData.mobile_no || ""}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address || ""}
              onChange={handleChange}
            />
            <input
              type="text"
              name="gardian_name"
              placeholder="Guardian Name"
              value={formData.gardian_name || ""}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="gardian_phone"
              placeholder="Guardian Phone"
              value={formData.gardian_phone || ""}
              onChange={handleChange}
            />
            <select
              name="dept_id"
              value={formData.dept_id || ""}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.long_name}
                </option>
              ))}
            </select>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="is_dismissed"
                name="is_dismissed"
                checked={formData.is_dismissed || false}
                onChange={handleChange}
                className="checkbox-field"
              />
              <label htmlFor="is_dismissed">Is Dismissed</label>
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="is_graduated"
                name="is_graduated"
                checked={formData.is_graduated || false}
                onChange={handleChange}
                className="checkbox-field"
              />
              <label htmlFor="is_graduated">Is Graduated</label>
            </div>
          </>
        );
      case "Department":
        return (
          <>
            <input
              type="number"
              name="dept_id"
              placeholder="Department ID"
              value={formData.dept_id || ""}
              onChange={handleChange}
              className="input-field"
              disabled={!!currentEditItem}
            />
            <input
              type="text"
              name="dept_short_name"
              placeholder="Short Name"
              value={formData.dept_short_name || ""}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="long_name"
              placeholder="Long Name"
              value={formData.long_name || ""}
              onChange={handleChange}
            />
          </>
        );
      default:
        return <p>No form configured for this model.</p>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint = selectedModel.endpoint;
    const pk = selectedModel.pk;
    const isEdit = !!currentEditItem;

    try {
      const response = await fetch(
        isEdit
          ? `${API_URL}/${endpoint}/${currentEditItem[pk]}`
          : `${API_URL}/${endpoint}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      toast.success(
        `${activeModel} ${isEdit ? "updated" : "created"} successfully!`
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEdit ? "update" : "create"} ${activeModel}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {currentEditItem ? `Edit ${activeModel}` : `Add New ${activeModel}`}
          </h3>
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {getFormFields()}
          <div className="modal-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <div className="submit-button-spinner animate-spin">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  Saving...
                </>
              ) : currentEditItem ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// --- ConfirmModal Component ---
// A custom confirmation modal to replace window.confirm
function ConfirmModal({ message, onConfirm, onCancel }) {
  return createPortal(
    <div className="modal-overlay">
      <style>{`
        /* Confirm Modal Styles */
        .confirm-modal-content {
          background-color: #2d3748;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .confirm-modal-content p {
          margin-bottom: 24px;
          font-size: 1rem;
        }

        .confirm-button-group {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .confirm-button, .cancel-button {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        
        .confirm-button {
          background-color: #f56565; /* bg-red-500 */
          color: white;
        }

        .confirm-button:hover {
          background-color: #e53e3e; /* hover:bg-red-600 */
        }

        .cancel-button {
          background-color: #a0aec0; /* bg-gray-400 */
          color: white;
        }

        .cancel-button:hover {
          background-color: #718096; /* hover:bg-gray-500 */
        }
      `}</style>
      <div className="confirm-modal-content">
        <p>{message}</p>
        <div className="confirm-button-group">
          <button onClick={onConfirm} className="confirm-button">
            Confirm
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
