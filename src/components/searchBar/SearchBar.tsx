import React from 'react';
import SearchIcon from "../../assets/search.svg?react";
import './SearchBar.scss';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortOrder: "asc" | "desc";
    onSortChange: (order: "asc" | "desc") => void;
    hideAdminContent: boolean;
    onHideAdminContentChange: (checked: boolean) => void;
    userRole: string;
    locationPathname: string;
    visibleContentLength: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    onSearchChange,
    sortOrder,
    onSortChange,
    hideAdminContent,
    onHideAdminContentChange,
    userRole,
    locationPathname,
    visibleContentLength
}) => {

    return (
        <div className="control-pannel-wrapper">
            <label htmlFor="searchInput">
                <SearchIcon />
                <input
                    type="text"
                    placeholder={`Search posts...`}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="search-input"
                    id='searchInput'
                /></label>
            <div className='control-pannel-buttons'>
                {locationPathname !== "/projects" && visibleContentLength >= 2 && (
                    <button
                        onClick={() => onSortChange(sortOrder === "asc" ? "desc" : "asc")}
                        className="sort-button"
                    >
                        {`Sort: ${sortOrder === "asc" ? "Old to New" : "New to Old"}`}
                    </button>
                )}
                {userRole === "admin" && (
                    <label htmlFor="checkbox">
                        <input
                            className="hide-admin-checkbox"
                            type="checkbox"
                            checked={hideAdminContent}
                            onChange={(e) => onHideAdminContentChange(e.target.checked)}
                        />
                        Show admin content
                    </label>
                )}
            </div>

        </div>
    );
};

export default SearchBar;