import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="body-wrapper">
            <h1>Home</h1>

        </div>
    );
};

export default Home;
