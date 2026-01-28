import { getBaseUrl, login, register } from "./api";

describe("api.getBaseUrl", () => {
  test("returns empty string when env var is not set (same-origin)", () => {
    const prev = process.env.REACT_APP_API_BASE;
    const prev2 = process.env.REACT_APP_API_BASE_URL;

    delete process.env.REACT_APP_API_BASE;
    delete process.env.REACT_APP_API_BASE_URL;

    expect(getBaseUrl()).toBe("");

    process.env.REACT_APP_API_BASE = prev;
    process.env.REACT_APP_API_BASE_URL = prev2;
  });

  test("strips trailing slash from absolute base url", () => {
    const prev = process.env.REACT_APP_API_BASE;
    process.env.REACT_APP_API_BASE = "https://example.com/";

    expect(getBaseUrl()).toBe("https://example.com");

    process.env.REACT_APP_API_BASE = prev;
  });
});

describe("api auth endpoints", () => {
  beforeEach(() => {
    // Ensure deterministic base url in tests
    process.env.REACT_APP_API_BASE = "https://api.example.com";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("register calls /api/auth/register with POST and JSON body", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: "t" }),
    });

    await register("a@b.com", "password123");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchSpy.mock.calls[0];

    expect(url).toBe("https://api.example.com/api/auth/register");
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.body).toBe(JSON.stringify({ email: "a@b.com", password: "password123" }));
  });

  test("login calls /api/auth/login with POST and JSON body", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: "t" }),
    });

    await login("a@b.com", "password123");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchSpy.mock.calls[0];

    expect(url).toBe("https://api.example.com/api/auth/login");
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.body).toBe(JSON.stringify({ email: "a@b.com", password: "password123" }));
  });
});
