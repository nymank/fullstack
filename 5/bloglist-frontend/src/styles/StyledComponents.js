import styled from "styled-components"
import { colors } from "./colors"
import { fonts } from "./fonts"

export const Page = styled.div`
    padding: 1em;
    background: ${colors.black};
    color: ${colors.white};
    min-height: 100vh;

    font-family: ${fonts.body};
    font-size: 18px;
    font-weight: 500;

    h1, h2 {
        font-family: ${fonts.heading};
        color: ${colors.yellow};
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    a {
        color: ${colors.cyan};
    }

    a:hover {
        color: ${colors.yellow};
    }
`

export const Navigation = styled.div`
    background: ${colors.yellow};
    color: ${colors.black};
    padding: 1em;
    border-bottom: 3px solid ${colors.cyan};

    a {
        color: ${colors.black};
        font-weight: bold;
        text-decoration: none;
    }

    a:hover {
        color: ${colors.red};
    }
`

export const Footer = styled.div`
    background: ${colors.darkRed};
    color: ${colors.red};
    padding: 1em;
    margin-top: 1em;
    border-top: 2px solid ${colors.red};
`

export const Button = styled.button`
    background: ${colors.black};
    color: ${colors.cyan};
    border: 1px solid ${colors.cyan};
    padding: 8px 18px;
    margin: 5px;

    font-family: ${fonts.terminal};
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;

    cursor: pointer;
    clip-path: polygon(
        0 0, 100% 0, 100% 70%, 90% 100%, 0 100%
    );

    transition: background 0.15s, color 0.15s;

    &:hover {
        background: ${colors.cyan};
        color: ${colors.black};
    }

    &:active {
        background: ${colors.yellow};
        color: ${colors.black};
    }

    &:focus-visible {
        background: ${colors.cyan};
        color: ${colors.black};
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`

export const DangerButton = styled(Button)`
    color: ${colors.red};
    border-color: ${colors.red};

    &:hover {
        background: ${colors.red};
        color: ${colors.black};
    }

    &:focus-visible {
        background: ${colors.red};
        color: ${colors.black};
    }
`

export const Input = styled.input`
    background: #11131a;
    color: ${colors.white};
    border: 2px solid ${colors.cyan};
    padding: 0.5em 0.75em;
    font-size: 1rem;
    outline: none;
    margin-bottom: 0.5em;
    min-width: 220px;

    &:focus {
        border-color: ${colors.yellow};
        box-shadow: 0 0 8px ${colors.yellow};
    }

    &::placeholder {
        color: #888;
    }
`

export const NotificationBox = styled.div`
    --accent: ${({ $type }) =>
        $type === "success" ? colors.cyan : colors.red};

    background: ${({ $type }) =>
        $type === "success" ? "#092529" : "#291019"};

    color: var(--accent);
    border: 1px solid var(--accent);
    border-left: 5px solid var(--accent);

    padding: 12px 18px;
    margin: 1em 0;

    font-family: ${fonts.terminal};
    font-size: 16px;

    clip-path: polygon(
        0 0, 100% 0, 100% calc(100% - 12px),
        calc(100% - 12px) 100%, 0 100%
    );

    &::before {
        content: "${({ $type }) =>
        $type === "success"
            ? "SYSTEM // SUCCESS"
            : "SYSTEM // ERROR"}";

        display: block;
        font-weight: bold;
        font-size: 12px;
        letter-spacing: 2px;
        padding-bottom: 6px;
        margin-bottom: 8px;
        border-bottom: 1px solid var(--accent);
    }

    animation: notification-enter 0.2s ease-out;

    @keyframes notification-enter {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }

        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`

export const Label = styled.label`
    font-family: ${fonts.terminal};
    font-size: 12px;
    color: ${colors.cyan};
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.5em;
`

export const Panel = styled.div`
    background: ${colors.black};
    border: 1px solid ${colors.cyan};
    padding: 1.5em;
    margin: 1em 0;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        width: 16px;
        height: 16px;
        background: ${colors.cyan};
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
    }
`

export const Stat = styled.div`
    background: #161820;
    border-left: 3px solid ${colors.cyan};
    padding: 12px 16px;
    margin: 1em 0;

    display: flex;
    align-items: center;
    gap: 1.5em;
`

export const StatValue = styled.div`
    font-family: ${fonts.heading};
    color: ${colors.cyan};
    font-size: 24px;
    letter-spacing: 2px;
`