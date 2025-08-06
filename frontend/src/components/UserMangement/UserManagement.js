import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./UserManagement.css"; // Import the standard CSS file

const UserManagementTable = () => {
  // All state declarations and initial data generation remain the same
  const generateSampleUsers = () => {
    const names = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Wilson",
      "David Brown",
      "Emily Davis",
      "Chris Miller",
      "Lisa Anderson",
      "Robert Taylor",
      "Amanda White",
      "Mark Thompson",
      "Jessica Lee",
      "Daniel Garcia",
      "Michelle Rodriguez",
      "Kevin Martinez",
      "Ashley Johnson",
      "Brian Wilson",
      "Nicole Brown",
      "Ryan Davis",
      "Stephanie Miller",
      "Justin Anderson",
      "Rachel Taylor",
      "Andrew Thomas",
      "Lauren Jackson",
      "Matthew White",
    ];
    const domains = [
      "example.com",
      "test.com",
      "demo.com",
      "sample.org",
      "company.net",
    ];
    const statuses = ["active", "inactive", "banned"];

    return Array.from({ length: 157 }, (_, i) => {
      const name = names[i % names.length];
      const email = `${name.toLowerCase().replace(" ", ".")}${
        i > 24 ? i : ""
      }@${domains[i % domains.length]}`;
      const joinDate = new Date(
        2024,
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 28) + 1
      );
      const lastActive = new Date(
        2024,
        Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 28) + 1
      );

      return {
        id: i + 1,
        name: i > 24 ? `${name} ${i}` : name,
        email,
        status: statuses[i % 3],
        joinDate: joinDate.toISOString().split("T")[0],
        lastActive: lastActive.toISOString().split("T")[0],
      };
    });
  };

  const [allUsers] = useState(generateSampleUsers());
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Customizable columns configuration
  const [columns, setColumns] = useState([
    { key: "name", label: "Name", visible: true, sortable: true },
    { key: "email", label: "Email", visible: false, sortable: true },
    { key: "status", label: "Status", visible: true, sortable: true },
    { key: "joinDate", label: "Join Date", visible: true, sortable: true },
    { key: "lastActive", label: "Last Active", visible: true, sortable: true },
    { key: "actions", label: "Actions", visible: true, sortable: false },
  ]);

  // All logic (fetchUsers, useEffect, handlers) remains the same
  // Simulate API call - in real app this would be an actual API call
  const fetchUsers = async (params = {}) => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const {
      page = 1,
      limit = 10,
      search = "",
      status = "all",
      dateFrom = "",
      dateTo = "",
      sortBy = "name",
      sortOrder = "asc",
    } = params;

    // Filter users based on parameters (simulating MongoDB queries)
    let filtered = allUsers.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" || user.status === status;

      const userJoinDate = new Date(user.joinDate);
      const matchesDateFrom =
        dateFrom === "" || userJoinDate >= new Date(dateFrom);
      const matchesDateTo = dateTo === "" || userJoinDate <= new Date(dateTo);

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "joinDate" || sortBy === "lastActive") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    // Update states
    setUsers(paginatedUsers);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / limit));
    setLoading(false);
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      status: statusFilter,
      dateFrom,
      dateTo,
      sortBy: sortField,
      sortOrder: sortDirection,
    };

    fetchUsers(params);
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDirection,
    allUsers,
  ]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, dateFrom, dateTo]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleUserStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";

    // In a real app, you would update the state on the server first,
    // then update the local state based on the successful response.
    const updatedAllUsers = allUsers.map((user) =>
      user.id === userId ? { ...user, status: newStatus } : user
    );
    // For this simulation, we'll just update the state directly.
    // In a real app, you'd probably call a function like:
    // setAllUsers(updatedAllUsers);
  };

  const handleRowClick = (user) => {
    console.log("Row clicked:", user);
  };

  const toggleColumn = (columnKey) => {
    setColumns(
      columns.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    let last;
    for (const page of range) {
      if (last) {
        if (page - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (page - last !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(page);
      last = page;
    }
    return rangeWithDots;
  };

  const getStatusBadge = (status) => {
    const statusClasses = classNames("user-management-table__status-badge", {
      "user-management-table__status-badge--active": status === "active",
      "user-management-table__status-badge--inactive": status === "inactive",
      "user-management-table__status-badge--banned": status === "banned",
    });
    return <span className={statusClasses}>{status}</span>;
  };

  return (
    <div className="user-management-table__container">
      <div className="user-management-table__header">
        <h1 className="user-management-table__title">User Management</h1>
        <p className="user-management-table__subtitle">
          Manage and monitor user accounts across your platform
        </p>

        <div className="user-management-table__controls">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="user-management-table__search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="user-management-table__filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="user-management-table__date-input"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="user-management-table__date-input"
          />
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
            className="user-management-table__filter-select"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        </div>

      <div className="user-management-table__wrapper">
        {loading && (
          <div className="user-management-table__loading-overlay">
            <div className="user-management-table__spinner"></div>
          </div>
        )}

        <table className="user-management-table__table">
          <thead className="user-management-table__head">
            <tr>
              {columns
                .filter((col) => col.visible)
                .map((column) => (
                  <th
                    key={column.key}
                    className={classNames(
                      "user-management-table__header-cell",
                      {
                        "user-management-table__header-cell--sortable":
                          column.sortable,
                      }
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.label}
                    {column.sortable && sortField === column.key && (
                      <span className="user-management-table__sort-icon">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="user-management-table__body">
            {!loading && users.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.filter((col) => col.visible).length}
                  className="user-management-table__no-results-cell"
                >
                  No users found matching your criteria
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="user-management-table__row"
                  onClick={() => handleRowClick(user)}
                >
                  {columns
                    .filter((col) => col.visible)
                    .map((column) => (
                      <td
                        key={column.key}
                        className="user-management-table__cell"
                      >
                        {(() => {
                          switch (column.key) {
                            case "name":
                              return (
                                <div className="user-management-table__user-info">
                                  <div className="user-management-table__user-avatar">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </div>
                                  <div className="user-management-table__user-details">
                                    <div className="user-management-table__user-name">
                                      {user.name}
                                    </div>
                                    <div className="user-management-table__user-email">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              );
                            case "email":
                              return user.email;
                            case "status":
                              return getStatusBadge(user.status);
                            case "joinDate":
                              return new Date(
                                user.joinDate
                              ).toLocaleDateString();
                            case "lastActive":
                              return new Date(
                                user.lastActive
                              ).toLocaleDateString();
                            case "actions":
                              return (
                                <div className="user-management-table__action-buttons">
                                  <button
                                    className={classNames(
                                      "user-management-table__action-button",
                                      {
                                        "user-management-table__action-button--unban":
                                          user.status === "banned",
                                        "user-management-table__action-button--ban":
                                          user.status !== "banned",
                                      }
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleUserStatus(user.id, user.status);
                                    }}
                                  >
                                    {user.status === "banned" ? "Unban" : "Ban"}
                                  </button>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })()}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="user-management-table__pagination-container">
          <div className="user-management-table__pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            users
          </div>
          <div className="user-management-table__pagination-controls">
            <button
              className="user-management-table__pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {getPaginationRange().map((page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className="user-management-table__pagination-dots"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  className={classNames(
                    "user-management-table__pagination-button",
                    {
                      "user-management-table__pagination-button--active":
                        currentPage === page,
                    }
                  )}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}
            <button
              className="user-management-table__pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
