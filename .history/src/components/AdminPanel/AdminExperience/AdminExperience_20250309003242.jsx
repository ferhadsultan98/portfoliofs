import { useEffect, useState } from "react";
import {
  database,
  ref,
  get,
  remove,
  update,
  push, // Yeni veri eklemek için push kullanıyoruz
} from "../../../firebase/Firebase";
import axios from "axios";
import './AdminExperience.scss';
import toast from "react-hot-toast";

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({
    company: "",
    description: "",
    location: "",
    year: "",
    companyLogo: "",
  });
  const [addFormData, setAddFormData] = useState({
    company: "",
    description: "",
    location: "",
    year: "",
    companyLogo: "",
  });
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null); // Yeni deneyim için ayrı bir image state

  const cloudinaryPreset = "farhadsultan";
  const cloudinaryCloudName = "dbiltdpxh";

  // Verileri Firebase'den çekme
  useEffect(() => {
    const experiencesRef = ref(database, "experiences");
    get(experiencesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const experienceList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setExperiences(experienceList);
        }
      })
      .catch((error) => {
        toast.error("Veri çekme başarısız: " + error.message, {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
      });
  }, []);

  // Silme işlemi
  const handleDelete = (id) => {
    const experienceRef = ref(database, "experiences/" + id);
    remove(experienceRef)
      .then(() => {
        setExperiences(experiences.filter((exp) => exp.id !== id));
        toast.success("Deneyim silindi!", {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
      })
      .catch((error) => {
        toast.error("Silme başarısız: " + error.message, {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
      });
  };

  // Düzenleme işlemi başlatma
  const handleEdit = (id) => {
    const experience = experiences.find((exp) => exp.id === id);
    setEditing(id);
    setEditFormData({
      company: experience.company,
      description: experience.description,
      location: experience.location,
      year: experience.year,
      companyLogo: experience.companyLogo,
    });
  };

  // Düzenleme formu için input değişiklikleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Yeni deneyim ekleme formu için input değişiklikleri
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Düzenleme için resim seçimi
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Yeni deneyim için resim seçimi
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  // Cloudinary'e resim yükleme
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryPreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      toast.error("Resim yükleme başarısız: " + error.message, {
        position: "top-center",
        style: {
          background: 'none',
          border: '1px solid #5a1d60',
          borderRadius: '15px',
          color: '#5a1d60',
        }
      });
      return null;
    }
  };

  // Yeni deneyim ekleme
  const handleAddExperience = async (e) => {
    e.preventDefault();
    let newCompanyLogo = addFormData.companyLogo;

    if (newImage) {
      newCompanyLogo = await uploadImageToCloudinary(newImage);
      if (!newCompanyLogo) {
        toast.error("Resim yükleme başarısız. Lütfen tekrar deneyin.", {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
        return;
      }
    }

    const experiencesRef = ref(database, "experiences");
    const newExperienceRef = push(experiencesRef); // Yeni bir ID oluşturur
    await update(newExperienceRef, {
      ...addFormData,
      companyLogo: newCompanyLogo,
    })
      .then(() => {
        setExperiences([
          ...experiences,
          { id: newExperienceRef.key, ...addFormData, companyLogo: newCompanyLogo },
        ]);
        setAddFormData({
          company: "",
          description: "",
          location: "",
          year: "",
          companyLogo: "",
        });
        setNewImage(null);
        toast.success("Yeni deneyim eklendi!", {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
      })
      .catch((error) => {
        toast.error("Ekleme başarısız: " + error.message, {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
      });
  };

  // Düzenleme işlemini kaydetme
  const handleSaveEdit = async (id) => {
    let newCompanyLogo = editFormData.companyLogo;

    if (image) {
      newCompanyLogo = await uploadImageToCloudinary(image);
      if (!newCompanyLogo) {
        toast.error("Resim yükleme başarısız. Lütfen tekrar deneyin.", {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
        return;
      }
    }

    const experienceRef = ref(database, "experiences/" + id);
    update(experienceRef, {
      ...editFormData,
      companyLogo: newCompanyLogo,
    })
      .then(() => {
        const updatedExperiences = experiences.map((exp) =>
          exp.id === id
            ? { ...exp, ...editFormData, companyLogo: newCompanyLogo }
            : exp
        );
        setExperiences(updatedExperiences);
        setEditing(null);
        setImage(null);
        toast.success("Deneyim güncellendi!", {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
      })
      .catch((error) => {
        toast.error("Güncelleme başarısız: " + error.message, {
          position: "top-center",
          style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          }
        });
      });
  };

  return (
    <div className="adminExperienceContainer">
      {/* Yeni Deneyim Ekleme Formu */}
      <div className="adminExperienceAddSection">
        <h3>Yeni Deneyim Ekle</h3>
        <form className="addForm" onSubmit={handleAddExperience}>
          <div className="editInputGroup">
            <label>Şirket</label>
            <input
              type="text"
              name="company"
              value={addFormData.company}
              onChange={handleAddInputChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="editInputGroup">
            <label>Yıl</label>
            <input
              type="date"
              name="year"
              value={addFormData.year}
              onChange={handleAddInputChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="editInputGroup">
            <label>Lokasyon</label>
            <input
              type="text"
              name="location"
              value={addFormData.location}
              onChange={handleAddInputChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="editInputGroup">
            <label>Açıklama</label>
            <textarea
              name="description"
              value={addFormData.description}
              onChange={handleAddInputChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="editInputGroup">
            <label>Şirket Logosu</label>
            <input type="file" accept="image/*" onChange={handleNewImageChange} />
            {newImage && <p>Seçilen Resim: {newImage.name}</p>}
          </div>
          <button type="submit">Ekle</button>
        </form>
      </div>

      {/* Düzenleme Formu */}
      {editing && (
        <div className="adminExperienceEditSection">
          <h3>Deneyimi Düzenle</h3>
          <div className="editForm">
            <div className="editInputGroup">
              <label>Şirket</label>
              <input
                type="text"
                name="company"
                value={editFormData.company}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
            </div>
            <div className="editInputGroup">
              <label>Yıl</label>
              <input
                type="date"
                name="year"
                value={editFormData.year}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
            </div>
            <div className="editInputGroup">
              <label>Lokasyon</label>
              <input
                type="text"
                name="location"
                value={editFormData.location}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
            </div>
            <div className="editInputGroup">
              <label>Açıklama</label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
            </div>
            <div className="editInputGroup">
              <label>Şirket Logosu</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {image && <p>Seçilen Resim: {image.name}</p>}
              {editFormData.companyLogo && !image && (
                <img src={editFormData.companyLogo} alt="Mevcut logo" />
              )}
            </div>
            <button onClick={() => handleSaveEdit(editing)}>Kaydet</button>
          </div>
        </div>
      )}

      {/* Deneyim Kartları */}
      <div className="adminExperienceCards">
        {experiences.map((experience) => (
          <div className="experienceCard" key={experience.id}>
            <div className="experienceCardLeft">
              <img
                src={experience.companyLogo}
                alt={experience.company}
                className="companyLogo"
              />
            </div>
            <div className="experienceCardRight">
              <div className="experienceCardHeader">
                <p>{experience.company}</p>
                <p className="year">{experience.year}</p>
              </div>
              <div className="experienceCardBody">
                <p className="location">{experience.location}</p>
                <p className="description">{experience.description}</p>
              </div>
              <div className="experienceCardActions">
                <button onClick={() => handleEdit(experience.id)}>Düzenle</button>
                <button onClick={() => handleDelete(experience.id)}>Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminExperience;