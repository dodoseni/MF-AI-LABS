variable "resource_group_name" {
  description = "Existing resource group name"
  type        = string
  default     = "demo-infra-rg"
}

variable "search_service_name" {
  description = "Azure AI Search service name"
  type        = string
  default     = "srch-levelup"
}

variable "storage_account_name" {
  description = "Azure Storage account name (must be globally unique, lowercase alphanumeric)"
  type        = string
  default     = "stlevelupdocs"
}

variable "openai_account_name" {
  description = "Azure OpenAI account name"
  type        = string
  default     = "aoai-levelup"
}

variable "app_url" {
  description = "Public URL of the LevelUp app for Entra ID redirect"
  type        = string
  default     = "http://localhost:3000"
}
