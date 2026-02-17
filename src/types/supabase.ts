export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type UserRole = 'super_admin' | 'district_manager' | 'store_manager' | 'department_manager' | 'associate' | 'client'
export type TierLevel = 'free' | 'solo' | 'business'
export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled'
export type RequestStatus = 'pending' | 'approved' | 'denied'

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    organization_id: string | null
                    role: UserRole | null
                    name: string | null
                    email: string | null
                    avatar_url: string | null
                    bio: string | null
                    certifications: Json | null
                    department: string | null
                    phone: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    organization_id?: string | null
                    role?: UserRole | null
                    name?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    certifications?: Json | null
                    department?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string | null
                    role?: UserRole | null
                    name?: string | null
                    email?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    certifications?: Json | null
                    department?: string | null
                    phone?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            organizations: {
                Row: {
                    id: string
                    business_name: string
                    tier: TierLevel
                    settings: Json | null
                    employee_count: number | null
                    employee_limit: number | null
                    public_profile_enabled: boolean | null
                    onboarding_data: Json | null
                    onboarding_complete: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    business_name: string
                    tier?: TierLevel
                    settings?: Json | null
                    employee_count?: number | null
                    employee_limit?: number | null
                    public_profile_enabled?: boolean | null
                    onboarding_data?: Json | null
                    onboarding_complete?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    business_name?: string
                    tier?: TierLevel
                    settings?: Json | null
                    employee_count?: number | null
                    employee_limit?: number | null
                    public_profile_enabled?: boolean | null
                    onboarding_data?: Json | null
                    onboarding_complete?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    organization_id: string
                    name: string
                    description: string | null
                    price: number | null
                    duration: number | null
                    category: string | null
                    image_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    name: string
                    description?: string | null
                    price?: number | null
                    duration?: number | null
                    category?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    name?: string
                    description?: string | null
                    price?: number | null
                    duration?: number | null
                    category?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            clients: {
                Row: {
                    id: string
                    organization_id: string
                    user_id: string | null
                    name: string
                    email: string | null
                    phone: string | null
                    notes: string | null
                    tags: string[] | null
                    status: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    user_id?: string | null
                    name: string
                    email?: string | null
                    phone?: string | null
                    notes?: string | null
                    tags?: string[] | null
                    status?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    user_id?: string | null
                    name?: string
                    email?: string | null
                    phone?: string | null
                    notes?: string | null
                    tags?: string[] | null
                    status?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    organization_id: string
                    name: string
                    category: string | null
                    price: number | null
                    stock: number | null
                    reorder_point: number | null
                    sku: string | null
                    description: string | null
                    image_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    name: string
                    category?: string | null
                    price?: number | null
                    stock?: number | null
                    reorder_point?: number | null
                    sku?: string | null
                    description?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    name?: string
                    category?: string | null
                    price?: number | null
                    stock?: number | null
                    reorder_point?: number | null
                    sku?: string | null
                    description?: string | null
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    }
                ]
            }
            ratings_reviews: {
                Row: {
                    id: string
                    organization_id: string
                    client_id: string | null
                    employee_id: string | null
                    rating: number | null
                    comment: string | null
                    testimonial_text: string | null
                    photo_url: string | null
                    is_public: boolean | null
                    response: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    client_id?: string | null
                    employee_id?: string | null
                    rating?: number | null
                    comment?: string | null
                    testimonial_text?: string | null
                    photo_url?: string | null
                    is_public?: boolean | null
                    response?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    client_id?: string | null
                    employee_id?: string | null
                    rating?: number | null
                    comment?: string | null
                    testimonial_text?: string | null
                    photo_url?: string | null
                    is_public?: boolean | null
                    response?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    organization_id: string
                    client_id: string | null
                    service_id: string | null
                    employee_id: string | null
                    booking_datetime: string
                    status: string
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    client_id?: string | null
                    service_id?: string | null
                    employee_id?: string | null
                    booking_datetime: string
                    status?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    client_id?: string | null
                    service_id?: string | null
                    employee_id?: string | null
                    booking_datetime?: string
                    status?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            vault_documents: {
                Row: {
                    id: string
                    organization_id: string
                    name: string
                    type: string
                    category: string | null
                    status: string
                    expiry_date: string | null
                    file_size: string | null
                    file_name: string | null
                    file_data: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    name: string
                    type?: string
                    category?: string | null
                    status?: string
                    expiry_date?: string | null
                    file_size?: string | null
                    file_name?: string | null
                    file_data?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    name?: string
                    type?: string
                    category?: string | null
                    status?: string
                    expiry_date?: string | null
                    file_size?: string | null
                    file_name?: string | null
                    file_data?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            vault_categories: {
                Row: {
                    id: string
                    organization_id: string
                    name: string
                    color: string | null
                    icon: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    name: string
                    color?: string | null
                    icon?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    name?: string
                    color?: string | null
                    icon?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
