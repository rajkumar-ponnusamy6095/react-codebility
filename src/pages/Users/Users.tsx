import { useEffect, useState } from "react";

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import isNil from "lodash/isNil";

import NotificationToast from "../../components/NotificationToast/NotificationToast";
import {
  deleteUser,
  getUsers,
} from "../../services/userService";
import { datePipe } from "../../utils/datePipe";

import type {
  User,
  UserPagination,
  UserRole,
  UserSortOrder,
  UserStatus,
} from "./user.types";

import "./Users.css";

type SortField = keyof User;
type SortDirection = UserSortOrder;

const PAGE_SIZE_OPTIONS = [5, 10, 25, 100] as const;

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<UserPagination>({
    page: 1,
    limit: PAGE_SIZE_OPTIONS[0],
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState(search);

  const [role, setRole] = useState<UserRole | "">("");

  const [status, setStatus] = useState<UserStatus | "">("");

  const [department, setDepartment] = useState("");

  const [sortField, setSortField] =
    useState<SortField>("id");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);

  const [refreshVersion, setRefreshVersion] = useState(0);

  const [userToDelete, setUserToDelete] =
    useState<Pick<User, "id" | "name"> | null>(null);

  const [notification, setNotification] = useState("");

  useEffect(() => {
    const state = location.state;
    if (
      typeof state !== "object" ||
      state === null ||
      !("userNotification" in state) ||
      typeof state.userNotification !== "string"
    ) {
      return;
    }

    setNotification(state.userNotification);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  /*
   * Load the requested users page
   */
  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getUsers(
          {
            page: currentPage,
            limit: pageSize,
            search: debouncedSearch.trim() || undefined,
            sortBy: sortField,
            sortOrder: sortDirection,
            role: role || undefined,
            status: status || undefined,
            department: department || undefined,
          },
          controller.signal,
        );

        if (isActive) {
          setUsers(response.data);
          setPagination(response.pagination);
        }
      } catch (error: unknown) {
        if (isActive) {
          setError(
            error instanceof Error ? error.message : "Failed to load users",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [
    currentPage,
    department,
    pageSize,
    refreshVersion,
    role,
    debouncedSearch,
    sortDirection,
    sortField,
    status,
  ]);

  const totalPages = Math.max(1, pagination.totalPages);

  /*
   * Change sorting
   */
  const handleSort = (
    field: SortField
  ) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  /*
   * Sort indicator
   */
  const getSortIcon = (
    field: SortField
  ) => {
    if (sortField !== field) {
      return (
        <i
          className="bi bi-arrow-down-up"
          aria-hidden="true"
        />
      );
    }

    return (
      <i
        className={`bi ${
          sortDirection === "asc"
            ? "bi-arrow-up"
            : "bi-arrow-down"
        }`}
        aria-hidden="true"
      />
    );
  };

  /*
   * Search
   */
  const handleSearch = (
    value: string
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    navigate("/users/new");
  };

  const handleEdit = (
    user: User
  ) => {
    navigate(`/users/${user.id}/edit`);
  };

  /*
   * Delete
   */
  const handleDelete = async () => {
    if (isNil(userToDelete)) {
      setError("Select a user before deleting.");
      return;
    }

    try {
      setError("");

      await deleteUser(userToDelete.id);
      setUserToDelete(null);
      setNotification(`User "${userToDelete.name}" deleted successfully.`);

      const newTotalPages = Math.max(
        1,
        Math.ceil((pagination.total - 1) / pageSize),
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
      setRefreshVersion((version) => version + 1);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete user");
      }
    }
  };

  const firstVisibleUser =
    pagination.total === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;
  const lastVisibleUser = Math.min(
    currentPage * pageSize,
    pagination.total,
  );

  const visiblePages = Array.from(
    new Set([
      1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      totalPages,
    ].filter((page) => page >= 1 && page <= totalPages)),
  ).sort((a, b) => a - b);

  const paginationItems = visiblePages.flatMap((page, index) => {
    const previousPage = visiblePages[index - 1];
    const items = [];

    if (previousPage !== undefined && page - previousPage > 1) {
      if (page - previousPage === 2) {
        items.push(
          <Pagination.Item
            key={previousPage + 1}
            active={previousPage + 1 === currentPage}
            onClick={() => setCurrentPage(previousPage + 1)}
          >
            {previousPage + 1}
          </Pagination.Item>,
        );
      } else {
        items.push(
          <Pagination.Ellipsis
            key={`ellipsis-${previousPage}-${page}`}
            disabled
          />,
        );
      }
    }

    items.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => setCurrentPage(page)}
        aria-label={`Go to page ${page}`}
      >
        {page}
      </Pagination.Item>,
    );

    return items;
  });

  return (
    <div className="users-page">

      {/* Header */}
      <div className="users-header">

        <div>
          <h1>Users</h1>

          <p>
            Manage application users
          </p>
        </div>

        <Button
          className="app-primary"
          onClick={handleAdd}
        >
          <i className="bi bi-person-plus-fill me-2" aria-hidden="true" />
          Add User
        </Button>

      </div>

      {/* Error */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {notification && (
        <NotificationToast
          message={notification}
          onClose={() => setNotification("")}
        />
      )}

      <Card className="users-card">

        <Card.Body>

          {/* Toolbar */}
          <Row className="align-items-center mb-3">

            <Col
              xs={12}
              md={6}
            >
              <Form.Control
                type="search"
                placeholder="Search users..."
                value={search}
                onChange={(event) =>
                  handleSearch(
                    event.target.value
                  )
                }
              />
            </Col>

            <Col
              xs={12}
              md={6}
              className="text-md-end mt-2 mt-md-0"
            >
              <span className="users-count">
                {pagination.total}{" "}
                user
                {pagination.total !==
                1
                  ? "s"
                  : ""}
              </span>
            </Col>

          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4} className="mb-2 mb-md-0">
              <Form.Select
                aria-label="Filter users by role"
                value={role}
                onChange={(event) => {
                  const value = event.target.value;
                  setRole(value === "user" || value === "admin" ? value : "");
                  setCurrentPage(1);
                }}
              >
                <option value="">All roles</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={4} className="mb-2 mb-md-0">
              <Form.Select
                aria-label="Filter users by status"
                value={status}
                onChange={(event) => {
                  const value = event.target.value;
                  setStatus(
                    value === "active" || value === "inactive" ? value : "",
                  );
                  setCurrentPage(1);
                }}
              >
                <option value="">All statuses</option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={4}>
              <Form.Select
                aria-label="Filter users by department"
                value={department}
                onChange={(event) => {
                  setDepartment(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Departments</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Administration">Administration</option>
                <option value="Operation">Operation</option>
                <option value="Marketing">Marketing</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Table */}
          {loading ? (
            <div className="users-loading">
              <Spinner animation="border" />
              <span>
                Loading users...
              </span>
            </div>
          ) : (
            <div className="table-responsive">

              <Table
                striped
                hover
                className="users-table"
              >
                <thead>
                  <tr>

                    <th
                      onClick={() =>
                        handleSort(
                          "name"
                        )
                      }
                      className="sortable"
                    >
                      Name{" "}
                      {getSortIcon(
                        "name"
                      )}
                    </th>

                    <th
                      onClick={() =>
                        handleSort("email")
                      }
                      className="sortable"
                    >
                      Email{" "}
                      {getSortIcon(
                        "email"
                      )}
                    </th>

                    <th>
                      Gender
                    </th>

                    <th>
                      Phone
                    </th>

                    <th
                      onClick={() =>
                        handleSort("department")
                      }
                      className="sortable"
                    >
                      Department{" "}
                      {getSortIcon("department")}
                    </th>

                    <th
                      onClick={() =>
                        handleSort("role")
                      }
                      className="sortable"
                    >
                      Role{" "}
                      {getSortIcon(
                        "role"
                      )}
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          "status"
                        )
                      }
                      className="sortable"
                    >
                      Status{" "}
                      {getSortIcon(
                        "status"
                      )}
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          "createdAt"
                        )
                      }
                      className="sortable"
                    >
                      Created{" "}
                      {getSortIcon(
                        "createdAt"
                      )}
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {users.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-5"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map(
                      (user) => (
                        <tr
                          key={user.id}
                        >

                          <td>
                            <div className="user-name">
                              {user.name}
                            </div>
                          </td>

                          <td>
                            {user.email}
                          </td>

                          <td className="user-gender">
                            {user.gender}
                          </td>

                          <td>
                            {
                              user.phone
                            }
                          </td>

                          <td>
                            {user.department}
                          </td>

                          <td className="user-role">
                            {user.role}
                          </td>

                          <td className="user-status">
                            <Badge
                              bg={user.status === "inactive" ? "secondary" : undefined}
                              className={user.status === "active" ? "status-badge-active" : undefined}
                            >
                              {
                                user.status
                              }
                            </Badge>
                          </td>

                          <td>
                            {
                              datePipe(user.createdAt)
                            }
                          </td>

                          <td>
                            <div className="user-actions">

                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() =>
                                  handleEdit(
                                    user
                                  )
                                }
                              >
                                <i className="bi bi-pencil-square me-1" aria-hidden="true" />
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() =>
                                  setUserToDelete({
                                    id: user.id,
                                    name: user.name,
                                  })
                                }
                              >
                                <i className="bi bi-trash3 me-1" aria-hidden="true" />
                                Delete
                              </Button>

                            </div>
                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>
              </Table>

            </div>
          )}

          {/* Pagination */}
          <div className="users-pagination">
            <div className="users-pagination-controls">
              <Form.Label
                className="mb-0"
                htmlFor="users-page-size"
              >
                Rows per page
              </Form.Label>
              <Form.Select
                id="users-page-size"
                size="sm"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Rows per page"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Select>
            </div>

            <span className="page-info">
              Showing {firstVisibleUser}–{lastVisibleUser} of{" "}
              {pagination.total} users
            </span>

            {totalPages > 1 && (
              <Pagination className="mb-0" aria-label="Users table pages">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                />

                {paginationItems}

                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                />
              </Pagination>
            )}
          </div>

        </Card.Body>

      </Card>

      {/* Delete Confirmation */}
      <Modal
        show={userToDelete !== null}
        onHide={() =>
          setUserToDelete(null)
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Delete User
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete {userToDelete?.name}?
        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() =>
              setUserToDelete(null)
            }
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
          >
            <i className="bi bi-trash3 me-2" aria-hidden="true" />
            Delete
          </Button>

        </Modal.Footer>
      </Modal>

    </div>
  );
}