import { Button as ArcButton, type ButtonProps as ArcButtonProps } from '../arc/button/button';
import { cn } from '../../lib/utils';

export interface ButtonProps extends Omit<ArcButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
}
export function Button({ variant = 'secondary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  const arcSize = size === 'icon' || size === 'icon-sm' ? 'md' : size;
  return <ArcButton {...props} type={type} variant={variant === 'outline' ? 'secondary' : variant}
    size={arcSize} className={cn(size.startsWith('icon') && 'shuiyin-icon-button', className)} />;
}
