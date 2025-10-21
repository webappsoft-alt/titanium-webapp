import { Menu, Dropdown } from "antd";
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

function MenuItem({ item, level = 0 }) {
  const hasChildren = item.children && item.children.length > 0;

  const menu = hasChildren ? {
    items: item.children.map((child) => ({
      key: child.value || child.label,
      label: child.children ? (
        <MenuItem item={child} level={level + 1} />
      ) : (
        <Link href={child?.slug ? `/product/${child.slug}` : child?.value}>
          <span className="text-gray-700 hover:text-blue-600 transition-colors">
            {child.label}
          </span>
        </Link>
      ),
      className: "py-1"
    }))
  } : null;

  return hasChildren ? (
    <Dropdown menu={menu} trigger={["hover"]} placement={level === 0 ? "bottomLeft" : "rightTop"}>
      <div className="flex items-center cursor-pointer justify-between">
        <Link href={item?.value || "#"} className={cn(
          "w-full flex items-center justify-between py-0 xl:text-sm max-xl:text-xs text-gray-700 hover:text-blue-600 transition-colors",
          level === 0 && "font-semibold whitespace-nowrap"
        )}>{item.label}</Link>
        {level === 0 ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronRight className="h-3 w-3 ml-1" />}
      </div>
    </Dropdown>
  ) : (
    <Link
      href={item?.slug ? `/product/${item.slug}` : item?.value}
      className={cn(
        "flex items-center justify-between px-3 py-2 xl:text-sm max-xl:text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors",
        level === 0 && "font-semibold whitespace-nowrap"
      )}
    >
      {item.label}
    </Link>
  );
}

export function MegaMenu() {
  const menuData = useSelector((state) => state.menu.items);

  return (
    <nav className="hidden lg:flex items-center">
      <div className="flex items-center xl:gap-5 max-xl:gap-3">
        {menuData.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </div>
    </nav>
  );
}