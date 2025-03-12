document.addEventListener("DOMContentLoaded", function () {
    fetchBlogs();
});

// Create a Blog
document.getElementById("blogForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    // Client-side Validation
    if (!validateInputs(title, content)) return;

    fetch("/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to add blog");
        return response.json();
    })
    .then(() => {
        displayMessage("Blog added successfully!", "success");
        fetchBlogs();
        document.getElementById("blogForm").reset();
    })
    .catch(error => displayMessage(error.message, "error"));
});

// Fetch all blogs
function fetchBlogs() {
    fetch("/blogs")
    .then(response => response.json())
    .then(blogs => {
        const blogContainer = document.getElementById("blogContainer");
        blogContainer.innerHTML = "";
        blogs.forEach(blog => {
            const div = document.createElement("div");
            div.classList.add("blog-card"); // Style consistency
            div.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editBlog(${blog.id}, '${blog.title}', '${blog.content}')">Edit</button>
                    <button class="delete-btn" onclick="deleteBlog(${blog.id})">Delete</button>
                </div>
            `;
            blogContainer.appendChild(div);
        });
    });
}

// Delete a blog
function deleteBlog(id) {
    fetch(`/blogs/${id}`, { method: "DELETE" })
    .then(response => {
        if (!response.ok) throw new Error("Failed to delete blog");
        return response.text();
    })
    .then(() => {
        displayMessage("Blog deleted successfully!", "success");
        fetchBlogs();
    })
    .catch(error => displayMessage(error.message, "error"));
}

// Edit a blog
function editBlog(id, oldTitle, oldContent) {
    const newTitle = prompt("Edit title:", oldTitle)?.trim();
    const newContent = prompt("Edit content:", oldContent)?.trim();

    if (!validateInputs(newTitle, newContent)) return;

    fetch(`/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update blog");
        return response.json();
    })
    .then(() => {
        displayMessage("Blog updated successfully!", "success");
        fetchBlogs();
    })
    .catch(error => displayMessage(error.message, "error"));
}

// 🛑 Client-side Validation Function
function validateInputs(title, content) {
    if (!title || title.length < 3 || title.length > 100) {
        displayMessage("Title must be between 3 and 100 characters!", "error");
        return false;
    }
    if (!content || content.length < 3 || content.length > 200) {
        displayMessage("Content must be between 3 and 200 characters!", "error");
        return false;
    }
    return true;
}

// 🔔 Display Message Function
function displayMessage(message, type) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = message;
    msgDiv.classList.add(type === "success" ? "success-msg" : "error-msg");

    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
}
