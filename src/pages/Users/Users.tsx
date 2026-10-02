import {
  useEffect,
  useMemo,
} from "react";
import { useState } from "react";

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
import { useNavigate } from "react-router";

import {
  deleteUser,
  getUsers,
} from "../../services/userService";

import type {
  User,
} from "./user.types";

import "./Users.css";

type SortField =
  | "id"
  | "firstName"
  | "email"
  | "role"
  | "status"
  | "createdAt";

type SortDirection = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 100] as const;

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [sortField, setSortField] =
    useState<SortField>("id");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);

  const [deleteUserId, setDeleteUserId] =
    useState<number | null>(null);

  /*
   * Load users
   */
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * Search + Sort
   */
  const filteredAndSortedUsers = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    let result = users.filter((user) => {
      if (!searchValue) {
        return true;
      }

      return (
        user.firstName
          .toLowerCase()
          .includes(searchValue) ||
        user.lastName
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue) ||
        user.mobileNumber.includes(
          searchValue
        ) ||
        user.role
          .toLowerCase()
          .includes(searchValue) ||
        user.status
          .toLowerCase()
          .includes(searchValue)
      );
    });

    result = [...result].sort(
      (a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (
          typeof aValue === "string" &&
          typeof bValue === "string"
        ) {
          const comparison =
            aValue.localeCompare(
              bValue
            );

          return sortDirection === "asc"
            ? comparison
            : -comparison;
        }

        if (
          typeof aValue === "number" &&
          typeof bValue === "number"
        ) {
          return sortDirection === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      }
    );

    return result;
  }, [
    users,
    search,
    sortField,
    sortDirection,
  ]);

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedUsers.length / pageSize),
  );

  const paginatedUsers =
    filteredAndSortedUsers.slice(
      (currentPage - 1) *
        pageSize,
      currentPage * pageSize
    );

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
    if (deleteUserId === null) {
      return;
    }

    try {
      setError("");

      await deleteUser(
        deleteUserId
      );

      setUsers((current) =>
        current.filter(
          (user) =>
            user.id !== deleteUserId
        )
      );

      setDeleteUserId(null);

      /*
       * If deleting the last item
       * on a page, move back.
       */
      const remainingItems =
        filteredAndSortedUsers.length - 1;

      const newTotalPages = Math.max(
        1,
        Math.ceil(remainingItems / pageSize),
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(1, newTotalPages));
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete user");
      }
    }
  };

  const firstVisibleUser =
    filteredAndSortedUsers.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;
  const lastVisibleUser = Math.min(
    currentPage * pageSize,
    filteredAndSortedUsers.length,
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
                {filteredAndSortedUsers.length}{" "}
                user
                {filteredAndSortedUsers.length !==
                1
                  ? "s"
                  : ""}
              </span>
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
                        handleSort("id")
                      }
                      className="sortable"
                    >
                      ID{" "}
                      {getSortIcon("id")}
                    </th>

                    <th
                      onClick={() =>
                        handleSort(
                          "firstName"
                        )
                      }
                      className="sortable"
                    >
                      Name{" "}
                      {getSortIcon(
                        "firstName"
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
                      Mobile
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

                  {paginatedUsers.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-5"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map(
                      (user) => (
                        <tr
                          key={user.id}
                        >

                          <td>
                            {user.id}
                          </td>

                          <td>
                            <div className="user-name">
                              {user.firstName}{" "}
                              {user.lastName}
                            </div>
                          </td>

                          <td>
                            {user.email}
                          </td>

                          <td>
                            {
                              user.mobileNumber
                            }
                          </td>

                          <td>
                            {user.role}
                          </td>

                          <td>
                            <Badge
                              bg={user.status === "INACTIVE" ? "secondary" : undefined}
                              className={user.status === "ACTIVE" ? "status-badge-active" : undefined}
                            >
                              {
                                user.status
                              }
                            </Badge>
                          </td>

                          <td>
                            {
                              user.createdAt
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
                                  setDeleteUserId(
                                    user.id
                                  )
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
              {filteredAndSortedUsers.length} users
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
        show={deleteUserId !== null}
        onHide={() =>
          setDeleteUserId(null)
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Delete User
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete
          this user?
        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() =>
              setDeleteUserId(null)
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