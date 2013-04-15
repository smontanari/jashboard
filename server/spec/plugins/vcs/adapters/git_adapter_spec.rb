require 'spec_helper'
require 'json_spec'
require 'stringio'
require 'grit'
require 'plugins/vcs/adapters/git_adapter'

module Jashboard
  module Plugin
    module Vcs
      describe GitAdapter do
        before(:each) do
          adapter_class = Class.new do
            include GitAdapter
          end
          @adapter = adapter_class.new
        end

        context("VCS runtime info retrieval") do
          before(:each) do
            @repo = double
            @repo.stub(:commits => [])
            Grit::Repo.should_receive(:new).with("test-basedir").and_return(@repo)
            @configuration = {working_directory: "test-basedir", history_length: 123, branch: nil, type: "git"}.to_struct
          end

          it("should retrieve the given number of commits from the 'master' branch if none is specified") do
            @repo.should_receive(:commits).with('master', 123)

            runtime_info = @adapter.get_git_runtime_info(@configuration)
          end

          it("should retrieve the given number of commits from the given branch") do
            @configuration = {working_directory: "test-basedir", history_length: 123, branch: "test-branch", type: "git"}.to_struct
            @repo.should_receive(:commits).with('test-branch', 123)

            runtime_info = @adapter.get_git_runtime_info(@configuration)
          end

          it("should return a collection of git commit info objects") do
            commit1 = stub_commit("test-commit_1", "test-committer_1", "committer1@test.com", "2012-09-10 17:28:34 +1000", "test-message1")
            commit2 = stub_commit("test-commit_2", "test-committer_2", "committer2@test.com", "2012-09-13 11:56:19 +1000", "test-message2")
      
            @repo.stub(:commits => [commit1, commit2])

            runtime_info = @adapter.get_git_runtime_info(@configuration)
            runtime_info.size.should == 2
            runtime_info[0].revision_id.should == "test-commit_1"
            runtime_info[0].date.should == "Mon Sep 10 17:28:34 2012 +1000"
            runtime_info[0].author.should == "test-committer_1"
            runtime_info[0].email.should == "committer1@test.com"
            runtime_info[0].message.should == "test-message1"
            runtime_info[1].revision_id.should == "test-commit_2"
            runtime_info[1].date.should == "Thu Sep 13 11:56:19 2012 +1000"
            runtime_info[1].author.should == "test-committer_2"
            runtime_info[1].email.should == "committer2@test.com"
            runtime_info[1].message.should == "test-message2"
          end
        end
  
        def stub_commit(id, author_name, author_email, date, message)
          committer = double.tap do |author|
            author.stub(:name => author_name)
            author.stub(:email => author_email)
          end
          double.tap do |commit|
            commit.stub(:id => id)
            commit.stub(:author => committer)
            commit.stub(:authored_date => Time.parse(date))
            commit.stub(:message => message)
          end
        end
      end
    end
  end
end
