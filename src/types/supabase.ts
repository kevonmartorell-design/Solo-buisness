export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_analysis_log: {
        Row: {
          analysis_type: string
          created_at: string
          data: Json | null
          id: string
          organization_id: string
          viewed_by: string | null
        }
        Insert: {
          analysis_type: string
          created_at?: string
          data?: Json | null
          id?: string
          organization_id: string
          viewed_by?: string | null
        }
        Update: {
          analysis_type?: string
          created_at?: string
          data?: Json | null
          id?: string
          organization_id?: string
          viewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_log_viewed_by_fkey"
            columns: ["viewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_analysis_logs: {
        Row: {
          created_at: string | null
          id: string
          input_data: Json | null
          organization_id: string | null
          output_result: Json | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_data?: Json | null
          organization_id?: string | null
          output_result?: Json | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          input_data?: Json | null
          organization_id?: string | null
          output_result?: Json | null
          type?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          employee_id: string | null
          event_type: string
          id: string
          location_id: string | null
          metric_value: number | null
          organization_id: string
          revenue: number | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          event_type: string
          id?: string
          location_id?: string | null
          metric_value?: number | null
          organization_id: string
          revenue?: number | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          event_type?: string
          id?: string
          location_id?: string | null
          metric_value?: number | null
          organization_id?: string
          revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          organization_id: string
          priority: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          organization_id: string
          priority?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          organization_id?: string
          priority?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_requests: {
        Row: {
          client_id: string | null
          created_at: string
          employee_id: string | null
          id: string
          notes: string | null
          organization_id: string
          requested_datetime: string
          service_id: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          requested_datetime: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          requested_datetime?: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_queues: {
        Row: {
          approver_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          organization_id: string | null
          priority: string | null
          reference_id: string
          request_type: string | null
          requester_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approver_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          organization_id?: string | null
          priority?: string | null
          reference_id: string
          request_type?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approver_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          organization_id?: string | null
          priority?: string | null
          reference_id?: string
          request_type?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assignments: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          organization_id: string | null
          shift_id: string | null
          status: Database["public"]["Enums"]["assignment_status"] | null
          updated_at: string | null
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          organization_id?: string | null
          shift_id?: string | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          updated_at?: string | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          organization_id?: string | null
          shift_id?: string | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          new_data: Json | null
          old_data: Json | null
          organization_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          organization_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          organization_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_datetime: string
          client_id: string | null
          created_at: string
          employee_id: string | null
          id: string
          notes: string | null
          organization_id: string
          service_id: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          booking_datetime: string
          client_id?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          booking_datetime?: string
          client_id?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          document_url: string | null
          employee_id: string
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          name: string
          organization_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          employee_id: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          name: string
          organization_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_url?: string | null
          employee_id?: string
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          name?: string
          organization_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_evidence: {
        Row: {
          created_at: string | null
          id: string
          record_id: string | null
          text_content: string | null
          type: string
          uploaded_by: string | null
          url: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          record_id?: string | null
          text_content?: string | null
          type: string
          uploaded_by?: string | null
          url?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          record_id?: string | null
          text_content?: string | null
          type?: string
          uploaded_by?: string | null
          url?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_evidence_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "compliance_records"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_frameworks: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      compliance_records: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          next_due_date: string | null
          notes: string | null
          organization_id: string | null
          requirement_id: string | null
          status: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          organization_id?: string | null
          requirement_id?: string | null
          status?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          organization_id?: string | null
          requirement_id?: string | null
          status?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_records_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "compliance_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_requirements: {
        Row: {
          created_at: string | null
          description: string | null
          framework_id: string | null
          id: string
          name: string
          renewal_period_days: number | null
          risk_level: string | null
          risk_weight: number | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          id?: string
          name: string
          renewal_period_days?: number | null
          risk_level?: string | null
          risk_weight?: number | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          id?: string
          name?: string
          renewal_period_days?: number | null
          risk_level?: string | null
          risk_weight?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_requirements_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_trainings: {
        Row: {
          certificate_url: string | null
          completion_date: string | null
          created_at: string | null
          employee_id: string | null
          expiration_date: string | null
          id: string
          score: number | null
          status: string
          training_id: string | null
        }
        Insert: {
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string | null
          employee_id?: string | null
          expiration_date?: string | null
          id?: string
          score?: number | null
          status?: string
          training_id?: string | null
        }
        Update: {
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string | null
          employee_id?: string | null
          expiration_date?: string | null
          id?: string
          score?: number | null
          status?: string
          training_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_trainings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_trainings_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          organization_id: string | null
          phone: string | null
          rating: number | null
          status: Database["public"]["Enums"]["employee_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          organization_id?: string | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          organization_id?: string | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string | null
          id: string
          organization_id: string
          receipt_url: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          organization_id: string
          receipt_url?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          organization_id?: string
          receipt_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          created_at: string | null
          description: string
          id: string
          occurred_at: string
          organization_id: string | null
          reported_by: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          occurred_at: string
          organization_id?: string | null
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          occurred_at?: string
          organization_id?: string | null
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          manager_id: string | null
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          manager_id?: string | null
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          manager_id?: string | null
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          organization_id: string
          read: boolean | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          organization_id: string
          read?: boolean | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          organization_id?: string
          read?: boolean | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          business_name: string
          created_at: string
          employee_count: number | null
          employee_limit: number | null
          id: string
          onboarding_complete: boolean | null
          onboarding_data: Json | null
          public_profile_enabled: boolean | null
          settings: Json | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_period_end: string | null
          subscription_status: string | null
          tier: Database["public"]["Enums"]["tier_level"]
          updated_at: string
        }
        Insert: {
          business_name: string
          created_at?: string
          employee_count?: number | null
          employee_limit?: number | null
          id?: string
          onboarding_complete?: boolean | null
          onboarding_data?: Json | null
          public_profile_enabled?: boolean | null
          settings?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          tier?: Database["public"]["Enums"]["tier_level"]
          updated_at?: string
        }
        Update: {
          business_name?: string
          created_at?: string
          employee_count?: number | null
          employee_limit?: number | null
          id?: string
          onboarding_complete?: boolean | null
          onboarding_data?: Json | null
          public_profile_enabled?: boolean | null
          settings?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          tier?: Database["public"]["Enums"]["tier_level"]
          updated_at?: string
        }
        Relationships: []
      }
      payroll_runs: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          pay_period_end: string
          pay_period_start: string
          processed_by: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          pay_period_end: string
          pay_period_start: string
          processed_by?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          pay_period_end?: string
          pay_period_start?: string
          processed_by?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_links: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          organization_id: string
          price: number | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          organization_id: string
          price?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          organization_id?: string
          price?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          organization_id: string
          price: number | null
          reorder_point: number | null
          sku: string | null
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          organization_id: string
          price?: number | null
          reorder_point?: number | null
          sku?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          organization_id?: string
          price?: number | null
          reorder_point?: number | null
          sku?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_locations: {
        Row: {
          location_id: string
          profile_id: string
        }
        Insert: {
          location_id: string
          profile_id: string
        }
        Update: {
          location_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_locations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_services: {
        Row: {
          profile_id: string
          service_id: string
        }
        Insert: {
          profile_id: string
          service_id: string
        }
        Update: {
          profile_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_services_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: Json | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          name: string | null
          organization_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string
          department?: string | null
          email?: string | null
          id: string
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings_reviews: {
        Row: {
          client_id: string | null
          comment: string | null
          created_at: string
          employee_id: string | null
          id: string
          is_public: boolean | null
          organization_id: string
          photo_url: string | null
          rating: number | null
          response: string | null
          testimonial_text: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          comment?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          is_public?: boolean | null
          organization_id: string
          photo_url?: string | null
          rating?: number | null
          response?: string | null
          testimonial_text?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          comment?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          is_public?: boolean | null
          organization_id?: string
          photo_url?: string | null
          rating?: number | null
          response?: string | null
          testimonial_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_reviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: string | null
          client_id: string | null
          comment: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          is_public: boolean | null
          organization_id: string | null
          rating: number | null
          response: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_public?: boolean | null
          organization_id?: string | null
          rating?: number | null
          response?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_public?: boolean | null
          organization_id?: string | null
          rating?: number | null
          response?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          is_system_role: boolean | null
          name: string
          organization_id: string | null
          permissions: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          organization_id?: string | null
          permissions?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          organization_id?: string | null
          permissions?: Json | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string
          created_by: string | null
          employee_id: string
          end_time: string
          id: string
          location_id: string | null
          notes: string | null
          organization_id: string
          start_time: string
          status: Database["public"]["Enums"]["shift_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          employee_id: string
          end_time: string
          id?: string
          location_id?: string | null
          notes?: string | null
          organization_id: string
          start_time: string
          status?: Database["public"]["Enums"]["shift_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          employee_id?: string
          end_time?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          organization_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["shift_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: number | null
          id: string
          image_url: string | null
          name: string
          organization_id: string
          price: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          name: string
          organization_id: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          name?: string
          organization_id?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_swaps: {
        Row: {
          created_at: string
          id: string
          manager_approval_required: boolean | null
          organization_id: string
          requesting_employee_id: string
          shift_id: string
          status: Database["public"]["Enums"]["request_status"]
          target_employee_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          manager_approval_required?: boolean | null
          organization_id: string
          requesting_employee_id: string
          shift_id: string
          status?: Database["public"]["Enums"]["request_status"]
          target_employee_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          manager_approval_required?: boolean | null
          organization_id?: string
          requesting_employee_id?: string
          shift_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          target_employee_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_swaps_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swaps_requesting_employee_id_fkey"
            columns: ["requesting_employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swaps_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swaps_target_employee_id_fkey"
            columns: ["target_employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_templates: {
        Row: {
          client_id: string | null
          created_at: string | null
          details: Json | null
          duration_hours: number | null
          end_time: string
          id: string
          location_id: string | null
          name: string
          organization_id: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          details?: Json | null
          duration_hours?: number | null
          end_time: string
          id?: string
          location_id?: string | null
          name: string
          organization_id?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          details?: Json | null
          duration_hours?: number | null
          end_time?: string
          id?: string
          location_id?: string | null
          name?: string
          organization_id?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          bill_rate: number | null
          client_id: string | null
          created_at: string | null
          end_time: string
          id: string
          location_id: string | null
          organization_id: string | null
          pay_rate: number | null
          positions_filled: number | null
          positions_needed: number | null
          required_certifications: string[] | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          bill_rate?: number | null
          client_id?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          location_id?: string | null
          organization_id?: string | null
          pay_rate?: number | null
          positions_filled?: number | null
          positions_needed?: number | null
          required_certifications?: string[] | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          bill_rate?: number | null
          client_id?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          location_id?: string | null
          organization_id?: string | null
          pay_rate?: number | null
          positions_filled?: number | null
          positions_needed?: number | null
          required_certifications?: string[] | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string | null
          employee_id: string
          id: string
          organization_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          organization_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          organization_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      time_off_requests: {
        Row: {
          created_at: string
          employee_id: string
          end_date: string
          id: string
          notes: string | null
          organization_id: string
          rejection_reason: string | null
          request_type: string
          reviewed_by: string | null
          start_date: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          notes?: string | null
          organization_id: string
          rejection_reason?: string | null
          request_type: string
          reviewed_by?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          organization_id?: string
          rejection_reason?: string | null
          request_type?: string
          reviewed_by?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_off_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_off_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_off_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          required_role: string | null
          validity_period_days: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          required_role?: string | null
          validity_period_days?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          required_role?: string | null
          validity_period_days?: number | null
        }
        Relationships: []
      }
      vault_categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vault_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vault_documents: {
        Row: {
          category: string | null
          created_at: string | null
          expiry_date: string | null
          file_data: string | null
          file_name: string | null
          file_size: string | null
          id: string
          name: string
          organization_id: string
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          expiry_date?: string | null
          file_data?: string | null
          file_name?: string | null
          file_size?: string | null
          id?: string
          name: string
          organization_id: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          expiry_date?: string | null
          file_data?: string | null
          file_name?: string | null
          file_size?: string | null
          id?: string
          name?: string
          organization_id?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vault_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_appointment_request: {
        Args: { p_request_id: string }
        Returns: undefined
      }
      create_public_booking: {
        Args: {
          p_datetime: string
          p_email: string
          p_emp_id: string
          p_name: string
          p_notes: string
          p_org_id: string
          p_phone: string
          p_service_id: string
        }
        Returns: undefined
      }
      get_user_org_id: { Args: never; Returns: string }
    }
    Enums: {
      appointment_status: "requested" | "confirmed" | "completed" | "cancelled"
      assignment_status:
        | "scheduled"
        | "confirmed"
        | "checked_in"
        | "checked_out"
        | "cancelled"
      certification_status: "valid" | "expiring" | "expired"
      employee_status: "active" | "inactive" | "on_leave"
      request_status: "pending" | "approved" | "denied"
      shift_status: "approved" | "pending" | "denied"
      tier_level: "free" | "solo" | "business"
      user_role:
        | "super_admin"
        | "district_manager"
        | "store_manager"
        | "department_manager"
        | "associate"
        | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["requested", "confirmed", "completed", "cancelled"],
      assignment_status: [
        "scheduled",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
      ],
      certification_status: ["valid", "expiring", "expired"],
      employee_status: ["active", "inactive", "on_leave"],
      request_status: ["pending", "approved", "denied"],
      shift_status: ["approved", "pending", "denied"],
      tier_level: ["free", "solo", "business"],
      user_role: [
        "super_admin",
        "district_manager",
        "store_manager",
        "department_manager",
        "associate",
        "client",
      ],
    },
  },
} as const

