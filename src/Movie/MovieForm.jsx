import { useState, useEffect } from "react";
import { Button, Form, Row, Col, Card, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../API/Api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const MovieFormWithCrewCast = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const [movieData, setMovieData] = useState({
    movieTitle: "",
    genre: "",
    language: "",
    duration: "",
    releaseDate: "",
    posterUrl: "",
    description: "",
  });

  const [crewCastList, setCrewCastList] = useState([
    { name: "", role: "", member_type: "", department: "", photo_url: "" },
  ]);

  const [errors, setErrors] = useState({ movie: {}, crewCast: [] });

  const patterns = {
    text: /^[a-zA-Z0-9 ,.'"-]{1,100}$/,
    duration: /^([0-9]{1,2}):([0-5][0-9])$/,
  };

  useEffect(() => {
    if (movieId) {
      Api.get(`/fetchMovie/${movieId}`)
        .then((res) => {
          const movie = res.data;
          setMovieData({
            movieTitle: movie.movieTitle || "",
            genre: movie.genre || "",
            language: movie.language || "",
            duration: movie.duration || "",
            releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
            posterUrl: movie.posterUrl || "",
            description: movie.description || "",
          });
        })
        .catch((err) => console.error("Error fetching movie:", err));
    }
  }, [movieId]);

  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      movie: { ...prev.movie, [name]: "" },
    }));
  };

  const handleCrewCastChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...crewCastList];
    updated[index][name] = value;
    setCrewCastList(updated);
  };

  const addCrewCast = () => {
    setCrewCastList([...crewCastList, { name: "", role: "", member_type: "", department: "", photo_url: "" }]);
  };

  const removeCrewCast = (index) => {
    const updated = [...crewCastList];
    updated.splice(index, 1);
    setCrewCastList(updated);
  };

  const validate = () => {
    let valid = true;
    const newErrors = { movie: {}, crewCast: [] };

    if (!patterns.text.test(movieData.movieTitle)) {
      newErrors.movie.movieTitle = "Invalid title";
      valid = false;
    }
    if (!patterns.text.test(movieData.genre)) {
      newErrors.movie.genre = "Invalid genre";
      valid = false;
    }
    if (!patterns.text.test(movieData.language)) {
      newErrors.movie.language = "Invalid language";
      valid = false;
    }
    if (!patterns.duration.test(movieData.duration)) {
      newErrors.movie.duration = "Format HH:MM";
      valid = false;
    }
    if (!movieData.releaseDate) {
      newErrors.movie.releaseDate = "Date required";
      valid = false;
    }
    if (movieData.description.trim().length < 10) {
      newErrors.movie.description = "Minimum 10 characters";
      valid = false;
    }

    if (!movieId) {
      crewCastList.forEach((member, idx) => {
        const ce = {};
        if (!patterns.text.test(member.name)) ce.name = "Invalid";
        if (!patterns.text.test(member.role)) ce.role = "Invalid";
        if (!patterns.text.test(member.member_type)) ce.member_type = "Invalid";
        if (!patterns.text.test(member.department)) ce.department = "Invalid";
        newErrors.crewCast[idx] = ce;
        if (Object.keys(ce).length) valid = false;
      });
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      MySwal.fire("Fix errors before submitting", "", "error");
      return;
    }

    try {
      let res;
      if (movieId) {
        await Api.put(`/updateMovie/${movieId}`, {
          ...movieData,
          user: { userId: 1 },
        });
      } else {
        res = await Api.post("/saveMovie", {
          ...movieData,
          user: { userId: 1 },
        });
        const savedId = res.data.movieId;
        await Promise.all(
          crewCastList.map((member) =>
            Api.post("/saveCrewAndCast", {
              ...member,
              movie: { movieId: savedId },
            })
          )
        );
      }

      MySwal.fire({
        icon: "success",
        title: movieId ? "Updated Successfully" : "Added Successfully",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
      });
      navigate("/admin/movies");
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Please try again later", "error");
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <Container>
        <div className="text-end mb-3">
          <Button variant={darkMode ? "light" : "dark"} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <Card style={{ maxWidth: "800px", margin: "0 auto" }} className="p-4 shadow-lg mb-3">
          <Form onSubmit={handleSubmit}>
            <h3 className="text-center fw-bold mb-4 text-primary">{movieId ? "Update Movie" : "Add Movie"}</h3>

            {/* Movie Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="movieTitle" value={movieData.movieTitle} onChange={handleMovieChange} isInvalid={!!errors.movie.movieTitle} />
              <Form.Control.Feedback type="invalid">{errors.movie.movieTitle}</Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control type="text" name="genre" value={movieData.genre} onChange={handleMovieChange} isInvalid={!!errors.movie.genre} />
                  <Form.Control.Feedback type="invalid">{errors.movie.genre}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Control type="text" name="language" value={movieData.language} onChange={handleMovieChange} isInvalid={!!errors.movie.language} />
                  <Form.Control.Feedback type="invalid">{errors.movie.language}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (HH:MM)</Form.Label>
                  <Form.Control type="text" name="duration" value={movieData.duration} onChange={handleMovieChange} isInvalid={!!errors.movie.duration} />
                  <Form.Control.Feedback type="invalid">{errors.movie.duration}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Release Date</Form.Label>
                  <Form.Control type="date" name="releaseDate" value={movieData.releaseDate} onChange={handleMovieChange} isInvalid={!!errors.movie.releaseDate} />
                  <Form.Control.Feedback type="invalid">{errors.movie.releaseDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Poster URL</Form.Label>
              <Form.Control type="text" name="posterUrl" value={movieData.posterUrl} onChange={handleMovieChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={movieData.description} onChange={handleMovieChange} isInvalid={!!errors.movie.description} />
              <Form.Control.Feedback type="invalid">{errors.movie.description}</Form.Control.Feedback>
            </Form.Group>

            {/* Crew & Cast - Only in Add */}
            {!movieId && (
              <>
              <h5 className="mt-4">Crew & Cast</h5>
{crewCastList.map((member, idx) => (
  <Card className="p-3 mb-3" key={idx}>
    <Row>
      <Col>
        <Form.Control
          placeholder="Name"
          name="name"
          value={member.name}
          onChange={(e) => handleCrewCastChange(idx, e)}
        />
      </Col>
      <Col>
        <Form.Control
          placeholder="Role"
          name="role"
          value={member.role}
          onChange={(e) => handleCrewCastChange(idx, e)}
        />
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <Form.Control
          placeholder="Type"
          name="member_type"
          value={member.member_type}
          onChange={(e) => handleCrewCastChange(idx, e)}
        />
      </Col>
      <Col>
        <Form.Control
          placeholder="Department"
          name="department"
          value={member.department}
          onChange={(e) => handleCrewCastChange(idx, e)}
        />
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <Form.Control
          placeholder="Photo URL"
          name="photo_url"
          value={member.photo_url}
          onChange={(e) => handleCrewCastChange(idx, e)}
        />
      </Col>
    </Row>
    <Button
      variant="danger"
      size="sm"
      className="mt-2"
      onClick={() => removeCrewCast(idx)}
    >
      Remove
    </Button>
  </Card>
))}
<Button variant="secondary" onClick={addCrewCast}>
  Add Crew/Cast
</Button>

              </>
            )}

            <div className="text-center mt-4">
              <Button type="submit" variant="primary" className="px-5">{movieId ? "Update Movie" : "Add Movie"}</Button>
            </div>

          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default MovieFormWithCrewCast;
