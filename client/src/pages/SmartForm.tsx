import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { SmartForm } from "@/packages/vueai-smartform/components/SmartForm";
import { useSmartForm } from "@/packages/vueai-smartform/hooks/useSmartForm";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ProviderSelector, { type AIProvider } from "@/components/ProviderSelector";

export default function SmartFormPage() {
  const { toast } = useToast();
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [model, setModel] = useState<string>('gpt-4o');
  
  // Update model when provider changes
  useEffect(() => {
    switch(provider) {
      case 'openai':
        setModel('gpt-4o');
        break;
      case 'claude':
        setModel('claude-3-7-sonnet-20250219');
        break;
      case 'gemini':
        setModel('gemini-1.5-pro');
        break;
      case 'huggingface':
        setModel('mistralai/Mistral-7B-Instruct-v0.2');
        break;
      case 'ollama':
        setModel('llama3');
        break;
      case 'deepseek':
        setModel('deepseek-chat');
        break;
      default:
        setModel('');
    }
  }, [provider]);
  
  // Define the schema with proper typing
  const schema: Record<string, {
    type: string;
    aiValidation?: boolean;
    selfHeal?: boolean;
    required?: boolean;
    label?: string;
  }> = {
    email: {
      type: 'email',
      aiValidation: true,
      selfHeal: true,
      required: true,
      label: 'Email Address'
    },
    name: {
      type: 'text',
      aiValidation: true,
      required: true,
      label: 'Full Name'
    },
    bio: {
      type: 'textarea',
      aiValidation: true,
      required: false,
      label: 'Bio (optional)'
    }
  };

  // Using plain options instead of passing provider/model directly to avoid type errors
  const { formData, errors, handleChange, validate, fixWithAI } = useSmartForm(schema);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validate();
    
    if (isValid) {
      toast({
        title: "Form submitted",
        description: "The form data has been submitted successfully",
      });
    }
  };

  const CodeBlock = ({ 
    title, 
    code,
    language = "bash"
  }: { 
    title: string; 
    code: string;
    language?: string;
  }) => {
    const handleCopyClick = async () => {
      await copyToClipboard(code);
      toast({
        title: "Copied to clipboard",
        description: "The code has been copied to your clipboard",
      });
    };

    return (
      <div className="code-block">
        <div className="code-header">
          <span>{title}</span>
          <button
            onClick={handleCopyClick}
            className="text-gray-400 hover:text-white text-sm"
            title="Copy to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          </button>
        </div>
        <div className="code-content">
          <pre>{code}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Package Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">@vueai/smartform</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center">
                <Star className="mr-1 h-3 w-3" /> 
                215
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                v1.0.0-beta
              </Badge>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            A Vue 3 component for building AI-powered forms with intelligent validation, self-healing inputs, and dynamic field generation based on context.
          </p>
        </div>

        {/* Live Demo */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Live Demo</h2>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
              <h3 className="font-medium">AI Smart Form Demo</h3>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="mb-4">
                <ProviderSelector
                  value={provider}
                  onChange={setProvider}
                  label="AI Provider"
                />
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <div className="mt-1 text-sm text-red-500 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.email}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-primary text-xs"
                          onClick={() => fixWithAI('email')}
                        >
                          Fix with AI
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <div className="mt-1 text-sm text-red-500 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-primary text-xs"
                          onClick={() => fixWithAI('name')}
                        >
                          Fix with AI
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio (optional)</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      className={`flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.bio ? "border-red-500" : ""}`}
                    />
                    {errors.bio && (
                      <div className="mt-1 text-sm text-red-500 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.bio}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-primary text-xs"
                          onClick={() => fixWithAI('bio')}
                        >
                          Fix with AI
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
              </form>
              
              <div className="mt-8">
                <h4 className="font-medium mb-2">Example Usage</h4>
                <CodeBlock 
                  title="Component Usage" 
                  code={`<template>
  <SmartForm 
    :schema="schema" 
    v-model="formData"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { SmartForm } from '@vueai/smartform'
import { ref } from 'vue'

const schema = {
  email: {
    type: 'email',
    aiValidation: true,
    selfHeal: true,
    required: true
  },
  name: {
    type: 'text',
    aiValidation: true,
    required: true
  },
  bio: {
    type: 'textarea',
    aiValidation: true,
    required: false
  }
}

const formData = ref({})

function handleSubmit(data) {
  console.log('Form submitted:', data)
}
</script>`} 
                />
                
                <h4 className="font-medium mt-6 mb-2">Using the Composable</h4>
                <CodeBlock 
                  title="Multi-Provider SmartForm" 
                  code={`<template>
  <div>
    <!-- Provider selection -->
    <div class="provider-selector mb-4">
      <label>Select AI Provider:</label>
      <select v-model="selectedProvider" @change="updateOptions">
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
        <option value="gemini">Gemini</option>
        <option value="huggingface">HuggingFace</option>
        <option value="ollama">Ollama</option>
        <option value="deepseek">DeepSeek</option>
      </select>
    </div>
    
    <!-- Form -->
    <form @submit.prevent="handleSubmit">
      <div v-for="(field, name) in schema" :key="name">
        <label>{{ field.label || name }}</label>
        
        <input 
          v-if="field.type !== 'textarea'"
          :type="field.type"
          :name="name"
          v-model="formData[name]"
          @input="validate(name)"
        />
        
        <textarea 
          v-else
          :name="name"
          v-model="formData[name]"
          @input="validate(name)"
        ></textarea>
        
        <div v-if="errors[name]" class="error">
          {{ errors[name] }}
          <button @click="fixWithAI(name)">Fix with AI</button>
        </div>
      </div>
      
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { useSmartForm } from '@vueai/smartform'
import { ref, computed, watch } from 'vue'

const selectedProvider = ref('openai')
const selectedModel = ref('gpt-4o')

// Update model when provider changes
watch(selectedProvider, (provider) => {
  switch(provider) {
    case 'openai':
      selectedModel.value = 'gpt-4o'
      break
    case 'claude':
      selectedModel.value = 'claude-3-7-sonnet-20250219'
      break
    case 'gemini':
      selectedModel.value = 'gemini-1.5-pro'
      break
    case 'huggingface':
      selectedModel.value = 'mistralai/Mistral-7B-Instruct-v0.2'
      break
    case 'ollama':
      selectedModel.value = 'llama3'
      break
    case 'deepseek':
      selectedModel.value = 'deepseek-chat'
      break
  }
})

const schema = {
  email: {
    type: 'email',
    aiValidation: true,
    selfHeal: true,
    required: true,
    label: 'Email Address'
  },
  name: {
    type: 'text',
    aiValidation: true,
    required: true,
    label: 'Full Name'
  },
  bio: {
    type: 'textarea',
    aiValidation: true,
    required: false,
    label: 'Bio (optional)'
  }
}

// Create smartForm instance with the configured options
const options = computed(() => ({
  schema: schema,
  provider: selectedProvider.value,
  model: selectedModel.value
}))

const { 
  formData, 
  errors, 
  validate, 
  handleChange,
  fixWithAI 
} = useSmartForm(schema)

// Use the provider/model directly in the validateFormField function
function updateOptions() {
  // In a real implementation, this would update the AI client provider:
  // aiClient = new AIClient({
  //   provider: selectedProvider.value,
  //   model: selectedModel.value
  // })
  
  // For this example, we'll just display a message
  console.log(\`Using \${selectedProvider.value} with model \${selectedModel.value}\`)
}

async function handleSubmit() {
  const isValid = await validate()
  if (isValid) {
    console.log('Form submitted with valid data')
  }
}
</script>`} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M9 12l2 2 4-4"></path>
                      <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">AI-Powered Validation</h3>
                </div>
                <p className="text-muted-foreground">
                  Goes beyond regex validation with semantic understanding of input data.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 8.5V3h-5.5"></path>
                      <path d="M18 7 9.5 15.5 5 11 2 14"></path>
                      <path d="M15 10v5h5"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Self-Healing Inputs</h3>
                </div>
                <p className="text-muted-foreground">
                  Automatically corrects common input errors with AI suggestions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="18" height="10" x="3" y="11" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                      <line x1="8" x2="16" y1="16" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">Dynamic Field Generation</h3>
                </div>
                <p className="text-muted-foreground">
                  Creates contextual form fields based on user needs and input history.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
