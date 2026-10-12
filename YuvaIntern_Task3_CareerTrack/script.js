const STORAGE_KEY = "careertrack-task3-v1";

const $ = (id) => document.getElementById(id);
let applications = loadApplications();
let toastTimer;

function loadApplications() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
        console.error("Could not load saved applications:", error);
        return [];
    }
}

function saveApplications() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (error) {
        console.error("Could not save applications:", error);
        showToast("Could not save data in this browser.");
    }
}

function escapeHtml(value = "") {
    const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };

    return String(value).replace(/[&<>"']/g, (character) => replacements[character]);
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getVisibleApplications() {
    const searchTerm = $("search").value.trim().toLowerCase();
    const selectedStatus = $("statusFilter").value;
    const selectedType = $("typeFilter").value;

    return applications
        .filter((application) => {
            const searchableText = [
                application.company,
                application.role,
                application.notes || "",
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);
            const matchesStatus =
                selectedStatus === "All statuses" ||
                application.status === selectedStatus;
            const matchesType =
                selectedType === "All types" ||
                application.jobType === selectedType;

            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((first, second) =>
            (second.createdAt || "").localeCompare(first.createdAt || "")
        );
}

function renderApplications() {
    $("total").textContent = applications.length;
    $("progress").textContent = applications.filter((application) =>
        ["Applied", "Interview"].includes(application.status)
    ).length;
    $("interviews").textContent = applications.filter(
        (application) => application.status === "Interview"
    ).length;
    $("offers").textContent = applications.filter(
        (application) => application.status === "Offer"
    ).length;

    const visibleApplications = getVisibleApplications();

    $("rows").innerHTML = visibleApplications.map((application) => `
        <tr>
            <td>
                <span class="company">${escapeHtml(application.company)}</span>
                <span class="role">${escapeHtml(application.role)}</span>
            </td>
            <td>${escapeHtml(application.jobType)}</td>
            <td>
                <span class="pill ${escapeHtml(application.status)}">
                    ${escapeHtml(application.status)}
                </span>
            </td>
            <td>${formatDate(application.applied)}</td>
            <td>${formatDate(application.followUp)}</td>
            <td>
                <button class="action" data-act="edit" data-id="${escapeHtml(application.id)}">
                    Edit
                </button>
                <button class="action" data-act="delete" data-id="${escapeHtml(application.id)}">
                    Delete
                </button>
                ${application.jobLink ? `
                    <button class="action" data-act="link" data-id="${escapeHtml(application.id)}">
                        Open link
                    </button>
                ` : ""}
            </td>
        </tr>
    `).join("");

    $("empty").style.display = visibleApplications.length ? "none" : "block";
    $("rows").closest("table").style.display =
        visibleApplications.length ? "table" : "none";

    const count = visibleApplications.length;
    $("resultCount").textContent =
        `Showing ${count} of ${applications.length} applications`;
}

function openApplicationForm(application = null) {
    $("appForm").reset();
    $("error").textContent = "";
    $("editId").value = application?.id || "";
    $("modalTitle").textContent = application
        ? "Edit application"
        : "Add application";

    $("company").value = application?.company || "";
    $("role").value = application?.role || "";
    $("jobType").value = application?.jobType || "Full-time";
    $("jobStatus").value = application?.status || "Wishlist";
    $("applied").value =
        application?.applied || new Date().toISOString().slice(0, 10);
    $("followUp").value = application?.followUp || "";
    $("jobLink").value = application?.jobLink || "";
    $("notes").value = application?.notes || "";

    $("modal").showModal();
    $("company").focus();
}

function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const company = $("company").value.trim();
    const role = $("role").value.trim();
    const jobLink = $("jobLink").value.trim();

    if (!company || !role) {
        $("error").textContent = "Company name and job role are required.";
        return;
    }

    if (jobLink && !/^https?:\/\/.+/i.test(jobLink)) {
        $("error").textContent =
            "Job link must begin with http:// or https://.";
        return;
    }

    const id = $("editId").value;
    const existingApplication = applications.find(
        (application) => application.id === id
    );

    const application = {
        id: id || (
            crypto.randomUUID
                ? crypto.randomUUID()
                : String(Date.now())
        ),
        company,
        role,
        jobType: $("jobType").value,
        status: $("jobStatus").value,
        applied: $("applied").value,
        followUp: $("followUp").value,
        jobLink,
        notes: $("notes").value.trim(),
        createdAt:
            existingApplication?.createdAt || new Date().toISOString(),
    };

    applications = existingApplication
        ? applications.map((item) => item.id === id ? application : item)
        : [application, ...applications];

    saveApplications();
    renderApplications();
    $("modal").close();

    showToast(
        existingApplication
            ? "Application updated."
            : "Application added."
    );
}

function handleTableAction(event) {
    const button = event.target.closest("button[data-act]");
    if (!button) return;

    const application = applications.find(
        (item) => item.id === button.dataset.id
    );
    if (!application) return;

    if (button.dataset.act === "edit") {
        openApplicationForm(application);
        return;
    }

    if (button.dataset.act === "delete") {
        const confirmed = confirm(
            `Delete the application for ${application.company}?`
        );

        if (!confirmed) return;

        applications = applications.filter(
            (item) => item.id !== application.id
        );

        saveApplications();
        renderApplications();
        showToast("Application deleted.");
        return;
    }

    if (button.dataset.act === "link" && application.jobLink) {
        window.open(application.jobLink, "_blank", "noopener,noreferrer");
    }
}

function exportApplicationsToCsv() {
    if (!applications.length) {
        showToast("Add an application before exporting.");
        return;
    }

    const columns = [
        "company",
        "role",
        "jobType",
        "status",
        "applied",
        "followUp",
        "jobLink",
        "notes",
    ];

    const escapeCsvCell = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvRows = [
        columns.join(","),
        ...applications.map((application) =>
            columns.map((column) => escapeCsvCell(application[column])).join(",")
        ),
    ];

    const csvContent = `\ufeff${csvRows.join("\r\n")}`;
    const file = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "careertrack-applications.csv";
    link.click();

    URL.revokeObjectURL(downloadUrl);
    showToast("CSV export downloaded.");
}

$("addBtn").addEventListener("click", () => openApplicationForm());
$("emptyAdd").addEventListener("click", () => openApplicationForm());
$("closeBtn").addEventListener("click", () => $("modal").close());
$("cancelBtn").addEventListener("click", () => $("modal").close());
$("appForm").addEventListener("submit", handleFormSubmit);
$("rows").addEventListener("click", handleTableAction);
$("search").addEventListener("input", renderApplications);
$("statusFilter").addEventListener("change", renderApplications);
$("typeFilter").addEventListener("change", renderApplications);
$("exportBtn").addEventListener("click", exportApplicationsToCsv);

renderApplications();
