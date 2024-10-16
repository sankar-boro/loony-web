import React from 'react'

export const ChapterNavContainer = ({
  children,
  onClick,
  isActive,
}: {
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLDivElement>
  isActive: boolean
}) => {
  return (
    <div
      className={`chapter-nav ${isActive ? 'active-nav' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const ButtonNavContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="chapter-nav">{children}</div>
}

export const MenuNavContainer = ({
  children,
  onClick,
  activeMenu,
  route,
}: {
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined
  route: string | undefined
  activeMenu?: string | undefined
}) => {
  return (
    <div
      className={`menu-nav flex-row p8_12 ${activeMenu}`}
      data-id={route}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const BasicMenuNavContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="menu-nav flex-row p8_12">{children}</div>
}

export const PageNavContainer = ChapterNavContainer

export const SectionNavContainer = ({
  children,
  onClick,
  isActive,
}: {
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLDivElement>
  isActive: boolean
}) => {
  return (
    <div
      className={`section-nav ${isActive ? 'active-nav' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const SectionsNavContainer = ({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) => {
  return (
    <div onClick={onClick} style={{ paddingLeft: '10%' }}>
      {children}
    </div>
  )
}
