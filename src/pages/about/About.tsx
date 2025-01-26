import React from "react";
import AboutData from "./About.json";
import "./About.scss";

const About: React.FC = () => {
    return <div className="body-wrapper">
        <div className="about-wrapper">
            <h1>About</h1>
            <section>
                <p>{AboutData.about}</p>
            </section>
            {/* Skills Section */}
            <section>
                <h2>Skills</h2>
                <ul>
                    {Object.entries(AboutData.skills).map(([category, skills], index) => (
                        <li key={index}>
                            <strong>{category.replace("_", " ").toUpperCase()}:</strong>{" "}
                            {skills.join(", ")}
                        </li>
                    ))}
                </ul>
            </section>
            {/* Work Experience Section */}
            <section>
                <h2>Work Experience</h2>
                {AboutData.work_experience.map((job, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                        <h3>{job.position}</h3>
                        <p>
                            <strong>Company:</strong> {job.company}
                        </p>
                        <p>
                            <strong>Location:</strong> {job.location}
                        </p>
                        <p>
                            <strong>Dates:</strong> {job.dates}
                        </p>
                        <ul>
                            {job.responsibilities.map((task, idx) => (
                                <li key={idx}>{task}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
            {/* Education Section */}
            <section>
                <h2>Education</h2>
                <p>
                    <strong>Degree:</strong> {AboutData.education.degree}
                </p>
                <p>
                    <strong>Institution:</strong> {AboutData.education.institution}
                </p>
                <p>
                    <strong>Dates:</strong> {AboutData.education.dates}
                </p>
            </section>
            {/* Languages Section */}
            <section>
                <h2>Languages</h2>
                <ul>
                    {Object.entries(AboutData.languages).map(([language, proficiency], index) => (
                        <li key={index}>
                            <strong>{language}:</strong> {proficiency}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    </div>
};

export default About;
