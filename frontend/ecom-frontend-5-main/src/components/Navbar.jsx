import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const fetchSearchResults = async (value) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${value}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleChange = (value) => {
    setInput(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.trim().length >= 1) {
      searchTimeout.current = setTimeout(() => {
        fetchSearchResults(value.trim());
      }, 300); // debounce delay
    } else {
      setSearchResults([]);
      setNoResults(false);
      setShowSearchResults(false);
    }
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand" href="https://github.com/SnehashisDasgupta/E-commerce-site">
              SPREACT BOOT
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add_product">
                    Add Product
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </a>
                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>

              <button className="theme-btn" onClick={toggleTheme}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              <div
                className="d-flex align-items-center cart"
                style={{ position: "relative" }}
              >
                <a href="/cart" className="nav-link text-dark">
                  <i
                    className="bi bi-cart me-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Cart
                  </i>
                </a>

                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchResults(false), 150)
                  }
                />

                {showSearchResults && (
                  <ul
                    className="list-group"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      backgroundColor: "white",
                      maxHeight: "250px",
                      overflowY: "auto",
                    }}
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.productId} className="list-group-item">
                          <a
                            href={`/product/${result.productId}`}
                            className="search-result-link"
                          >
                            {result.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <li className="list-group-item text-muted">
                          No Product with such Name
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;